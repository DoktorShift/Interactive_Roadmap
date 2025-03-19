import os
import json
import logging
import fcntl  # For file locking on Unix-based systems
from logging.handlers import RotatingFileHandler
from flask import Flask, request, jsonify
from flask_cors import CORS  # type: ignore

app = Flask(__name__)
CORS(app)

# Optional Whitelist Configuration:
ENABLE_WHITELIST = False  # Set to True to enable IP whitelisting
WHITELIST = {'127.0.0.1'}  # Add allowed IP addresses here

# Directories for payments and logs (relative to the backend folder)
PAYMENTS_DIR = os.path.join(os.path.dirname(__file__), 'payments')
LOGS_DIR = os.path.join(os.path.dirname(__file__), 'logs')

# Ensure that the payments and logs directories exist
os.makedirs(PAYMENTS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

# Logging Configuration: logs are stored in a rotating log file within the LOGS_DIR.
logger = logging.getLogger('LNBitsWebhook')
logger.setLevel(logging.INFO)

# Console Handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# File Handler with rotation: max. 10 MB per file, 5 backup files
log_file_path = os.path.join(LOGS_DIR, 'app.log')
file_handler = RotatingFileHandler(log_file_path, maxBytes=10*1024*1024, backupCount=5)
file_handler.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

logger.addHandler(console_handler)
logger.addHandler(file_handler)

# File used to store votes
VOTES_FILE = os.path.join(PAYMENTS_DIR, 'votes.json')

def get_data_file(lnurlp_id):
    """Return the file path where payments for the given LNURLP id are stored."""
    filename = f'payments_{lnurlp_id}.txt'
    return os.path.join(PAYMENTS_DIR, filename)

def save_payment(lnurlp_id, amount, comment):
    """Append a payment record to the corresponding file using a file lock to synchronize
    concurrent write accesses.
    
    amount: Payment amount in sat (internally already in sat).
    """
    payment = {"lnurlp_id": lnurlp_id, "amount": amount, "comment": comment}
    data_file = get_data_file(lnurlp_id)
    try:
        with open(data_file, 'a') as f:
            # Request an exclusive lock
            fcntl.flock(f, fcntl.LOCK_EX)
            f.write(json.dumps(payment) + "\n")
            f.flush()
            # Release the lock
            fcntl.flock(f, fcntl.LOCK_UN)
        logger.info(f"Saved payment for LNURLP {lnurlp_id}: amount {amount} (sat), comment: '{comment}'")
    except Exception as e:
        logger.error(f"Error saving payment for LNURLP {lnurlp_id}: {e}")

def load_votes():
    """Load votes from file."""
    if os.path.exists(VOTES_FILE):
        try:
            with open(VOTES_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_votes(votes):
    """Save votes to file."""
    try:
        with open(VOTES_FILE, 'w') as f:
            json.dump(votes, f)
    except Exception as e:
        logger.error(f"Error saving votes: {e}")

@app.before_request
def limit_remote_addr():
    """Check before each request if the client's IP address is in the whitelist (if enabled)."""
    if ENABLE_WHITELIST:
        client_ip = request.remote_addr
        if client_ip not in WHITELIST:
            logger.warning(f"Unauthorized access attempt from IP: {client_ip}")
            return jsonify({"error": "Unauthorized"}), 403

@app.route('/webhook', methods=['POST'])
def webhook():
    """
    Webhook endpoint that receives a payment from LNURLP.
    Expects a JSON payload including:
      - "lnurlp": a unique identifier for the LNURLP instance.
      - "amount": the payment amount in msat (milli-satoshis).
      - "comment": a comment for the payment.
      
    The 'amount' is converted from msat to sat.
    """
    try:
        data = request.get_json()
        if not data:
            logger.error("Invalid JSON received")
            return jsonify({"error": "Invalid JSON"}), 400

        lnurlp_id = data.get('lnurlp')
        if not lnurlp_id:
            logger.error("Missing 'lnurlp' in the payload")
            return jsonify({"error": "Missing 'lnurlp' field"}), 400

        amount_msat = data.get('amount')
        comment = data.get('comment', '')

        if amount_msat is None:
            logger.error(f"Missing 'amount' field for LNURLP {lnurlp_id}")
            return jsonify({"error": "'amount' field missing"}), 400

        # Convert msat to sat
        amount_sat = amount_msat // 1000

        logger.info(
            f"Received payment for LNURLP {lnurlp_id}: "
            f"{amount_msat} msat => {amount_sat} sat, comment: '{comment}'"
        )

        save_payment(lnurlp_id, amount_sat, comment)

        return jsonify({"status": "success"}), 200

    except Exception as e:
        logger.exception(f"Unhandled exception in webhook: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/payments/<lnurlp_id>', methods=['GET'])
def get_payments(lnurlp_id):
    """
    Endpoint to retrieve all payments for a specific LNURLP id.
    Payments are read from the corresponding file.
    """
    payments = []
    data_file = get_data_file(lnurlp_id)
    try:
        if os.path.exists(data_file):
            with open(data_file, 'r') as f:
                for line in f:
                    if line.strip():
                        payments.append(json.loads(line))
        else:
            logger.info(f"No payment file found for LNURLP {lnurlp_id}")
    except Exception as e:
        logger.error(f"Error reading payment file for LNURLP {lnurlp_id}: {e}")
        return jsonify({"error": "Internal server error"}), 500

    logger.info(f"Returning {len(payments)} payments for LNURLP {lnurlp_id}")
    return jsonify(payments)

@app.route('/vote', methods=['POST'])
def vote():
    """
    Upvotes a feature.
    Expects a JSON payload with:
      - "feature_id": The ID of the feature being voted for.
    """
    try:
        data = request.get_json()
        feature_id = str(data.get("feature_id"))  # Store as string to avoid int-key issues

        if not feature_id:
            return jsonify({"error": "Missing feature_id"}), 400

        votes = load_votes()
        votes[feature_id] = votes.get(feature_id, 0) + 1
        save_votes(votes)

        logger.info(f"Feature {feature_id} upvoted. Total votes: {votes[feature_id]}")
        return jsonify({"status": "success", "upvotes": votes[feature_id]})
    except Exception as e:
        logger.error(f"Error in voting: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/votes', methods=['GET'])
def get_votes():
    """Fetches the current vote counts."""
    votes = load_votes()
    return jsonify(votes)

# Global error handling to return JSON responses for system errors.
@app.errorhandler(404)
def handle_404(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(405)
def handle_405(error):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def handle_500(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Debug mode is disabled. For production, use a WSGI server.
    app.run(port=5000, debug=False)
