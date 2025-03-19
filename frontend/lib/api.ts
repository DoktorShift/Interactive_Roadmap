import type { Payment } from "@/types"

export async function fetchPayments(lnurlp: string): Promise<Payment[]> {
  try {
    // First try the real API
    try {
      const response = await fetch(`https://roadapi.mybuho.de/payments/${lnurlp}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn("Failed to fetch from real API:", error)
    }

    // Fallback to local API if available
    try {
      const response = await fetch(`/api/payments/${lnurlp}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn("Failed to fetch from local API:", error)
    }

    // Return empty data as last resort
    return getEmptyPayments()
  } catch (error) {
    console.error("Error fetching payments:", error)
    return []
  }
}

// Fallback function that returns empty data instead of mock data
function getEmptyPayments(): Payment[] {
  return []
}

