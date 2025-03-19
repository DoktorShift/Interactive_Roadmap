import { NextResponse } from "next/server"

// This is a proxy to avoid CORS issues with the Flask backend
export async function GET(request: Request, { params }: { params: { lnurlp: string } }) {
  try {
    const response = await fetch(`https://roadapi.mybuho.de/payments/${params.lnurlp}`)
    if (!response.ok) throw new Error(`Failed to fetch payments: ${response.statusText}`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching payments:", error)
    // Return empty array instead of mock data
    return NextResponse.json([])
  }
}

