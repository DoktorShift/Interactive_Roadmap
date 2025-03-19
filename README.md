# Buho_Roadmap
#### Users feedback and support could directly influence which features you build next.

### Install-Guide for both your back/- and frontend, integrating Caddy and PM2 for a seamless 24/7 deployment. 🚀  

---

### **1️⃣ Backend Setup (Python & Flask)**
```bash
# Update & install dependencies
sudo apt update && sudo apt install -y python3 python3-venv python3-pip

# Navigate to your backend directory
cd /path/to/your/backend

# Create & activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask app using PM2 for 24/7 uptime
pm2 start "venv/bin/python3 /path/to/your/backend/app.py" --name flask-backend
pm2 save
pm2 startup
```

---

### **2️⃣ Frontend Setup (Vue/React/Quasar)**
```bash
# Install Node.js & npm (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Navigate to frontend directory
cd /path/to/your/frontend

# Install dependencies & build project
npm install
npm run build

# Serve frontend with Caddy (modern & lightweight)
sudo tee /etc/caddy/Caddyfile > /dev/null <<EOF
yourdomain.com {
    root * /path/to/your/frontend/dist
    file_server
}
EOF

# Restart Caddy to apply changes
sudo systemctl restart caddy
```

---

### **3️⃣ Keep Everything Running 24/7**
```bash
# Ensure PM2 keeps running after reboot
pm2 startup
pm2 save

# Check status anytime
pm2 list
```

---

### 🎉 **App is now running beautifully!**  
- **Flask Backend:** Running persistently with PM2  
- **Frontend:** Served via Caddy for a lightweight, modern setup  
- **Deployment:** Just `pm2 restart flask-backend && npm run build && sudo systemctl restart caddy`  

/**
 * 🚨 IMPORTANT NOTE 🚨
 * 
 * This file (`/frontend/app/page.tsx`) is the **ONLY** place where you can:
 *  ✅ Add new feature cards
 *  ✅ Edit existing feature cards
 *  ✅ Remove feature cards
 * 
 * ➤ **How to add a new feature?**
 *   1. Duplicate an existing object card object.
 *   2. Change the `id`, `name`, `description`, `status`(idea, planned, progress, launched), `target`, `lnurlp`, and `lnurl`
 *   3. Save the file, do `npm run build`, restart caddy and check the UI
 * 
 * ➤ **What is `lnurlp` and `lnurl`?**
 *   - `lnurlp` = The **LNURLP ID** (Payment identifier)
 *   - `lnurl`  = The **LNURL string** (Corresponding payment link)
 * 
 * 🔥 **If you break something, revert your changes and retry carefully.**
 */
