"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

interface Donation {
  id: string
  amount: number
  message: string
  timestamp: string
}

export function RecentActivity() {
  const [donations, setDonations] = useState<Donation[]>([])

  useEffect(() => {
    // Real API fetch
    const fetchDonations = async () => {
      try {
        const response = await fetch("/api/recent-donations")
        if (response.ok) {
          const data = await response.json()
          setDonations(data)
        } else {
          // If API returns error, keep empty state
          console.warn("API returned error status")
        }
      } catch (error) {
        // If API fetch fails, log error but don't use mock data
        console.error("Failed to fetch donations:", error)
      }
    }

    fetchDonations()
    const interval = setInterval(fetchDonations, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-background p-1">
      <Card className="bg-background/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Recent Contributions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {donations.slice(0, 3).map((donation) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {donation.amount} sats
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(donation.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  {donation.message && <p className="text-sm text-muted-foreground">{donation.message}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {donations.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No recent contributions yet. Be the first to support!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

