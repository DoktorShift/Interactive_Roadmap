"use client"

import { Badge } from "@/components/ui/badge"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { QRModal } from "@/components/qr-modal"
import { useState, useEffect, useRef } from "react"
import type { Feature, Payment } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { fetchPayments } from "@/lib/api"

export default function Page() {
  // Initial Features – donationTotal is initially 0
  const initialFeatures: Feature[] = [
    {
      id: 1,
      name: "Nostr Wallet Connect",
      description:
        "Connect your wallet to Apps. 'Connections' will allow seamless interaction with the Nostr network, enabling users to bring their wallet into several Applications.",
      status: "Progress",
      upvotes: 0,
      donationTotal: 0,
      target: 500000,
      lnurlp: "MTx7Af",
      lnurl: "LNURL1DP68GURN8GHJ7ARFD4JKXCT5VD5X2U3WD3HXY6T5WVHXGEF0D3H82UNVWQH564RCXAQKV7J7TSN",
      comments: [],
    },
    {
      id: 2,
      name: "BuhoGo Native App",
      description:
        "A native app for iOS and Android with offline capabilities connected via Nostr to your Buho Wallet. Built with performance and user experience in mind, this app will provide functionality in quick on tho GO payments.",
      status: "Progress",
      upvotes: 0,
      donationTotal: 0,
      target: 600000,
      lnurlp: "T7S7cy",
      lnurl: "LNURL1DP68GURN8GHJ7ARFD4JKXCT5VD5X2U3WD3HXY6T5WVHXGEF0D3H82UNVWQH4GD6NXA3HJW978JP",
      comments: [],
    },
    {
      id: 3,
      name: "Internal Chat based on Nostr",
      description: "You will be able to chat with every Buho User via inApp Chat.",
      status: "Planned",
      upvotes: 0,
      donationTotal: 0,
      target: 450000,
      lnurlp: "LCXsAL",
      lnurl: "LNURL1DP68GURN8GHJ7ARFD4JKXCT5VD5X2U3WD3HXY6T5WVHXGEF0D3H82UNVWQH5CS6CWDQ5C56MTH6",
      comments: [],
    },
    {
      id: 4,
      name: "Launch Buho Wallet",
      description: "A Web Based Lightning Wallet with many features and useful stuff simplified for our friends.",
      status: "Launched",
      upvotes: 0,
      donationTotal: 0,
      target: 1,
      lnurlp: "UZQmih",
      lnurl: "LNURL1DP68GURN8GHJ7ARFD4JKXCT5VD5X2U3WD3HXY6T5WVHXGEF0D3H82UNVWQH42KJ3D45KSXEY8R6",
      comments: [],
    },
    {
      id: 5,
      name: "Integrate Hardware Wallet Support",
      description:
        "We consider to integrate a hardware Wallet Bridge which would enable buho to act as a frontend for your hardware wallet. Buho would never touch your keys. It interacts only as a frontend for your offline hardware wallet.",
      status: "Idea",
      upvotes: 0,
      donationTotal: 0,
      target: 1,
      lnurlp: "CNK3K6",
      lnurl: "LNURL1DP68GURN8GHJ7ARFD4JKXCT5VD5X2U3WD3HXY6T5WVHXGEF0D3H82UNVWQH5XNJTXD9NV78JCKE",
      comments: [],
    },
  ]

  const [featureList, setFeatures] = useState<Feature[]>(initialFeatures.sort((a, b) => b.upvotes - a.upvotes))
  const [isLoading, setIsLoading] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [selectedLnurl, setSelectedLnurl] = useState<string | null>(null)
  const { toast } = useToast()

  // Keep a reference to the latest featureList
  const featureListRef = useRef(featureList)
  useEffect(() => {
    featureListRef.current = featureList
    // For debugging: expose it globally
    ;(window as any).featureList = featureList
    console.log("Updated featureList:", featureList)
  }, [featureList])

  // Fetch payments for each feature, sum donations, and update comments
  async function updateFeatureWithPayments() {
    setIsLoading(true)
    try {
      const updated = await Promise.all(
        featureListRef.current.map(async (feature) => {
          try {
            const payments: Payment[] = await fetchPayments(feature.lnurlp)
            const totalDonations = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
            const comments = payments.filter((p) => p.comment && p.comment.trim() !== "").map((p) => p.comment)
            return { ...feature, donationTotal: totalDonations, comments }
          } catch (error) {
            console.error(`Error fetching payments for feature ${feature.id}:`, error)
            // Return feature with unchanged data instead of potentially corrupting it
            return feature
          }
        }),
      )

      // Only update state if we have valid data
      if (updated && updated.length > 0) {
        // Sort features by donationTotal (descending)
        setFeatures(updated.sort((a, b) => b.donationTotal - a.donationTotal))
      }
    } catch (error) {
      console.error("Error updating features:", error)
      toast({
        title: "Error updating donations",
        description: "Failed to fetch latest donation data. Will try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update donations on mount and then every 10 minutes
  useEffect(() => {
    updateFeatureWithPayments()
    const interval = setInterval(updateFeatureWithPayments, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [toast])

  // Fetch the latest votes on page load from the backend
  useEffect(() => {
    async function fetchVotes() {
      try {
        const response = await fetch("https://roadapi.mybuho.de/votes")
        if (!response.ok) throw new Error("Failed to fetch votes")
        const votes = await response.json()

        // Only update if we have valid data
        if (votes && typeof votes === "object") {
          setFeatures((prev) =>
            prev
              .map((feature) => ({
                ...feature,
                upvotes: votes[feature.id] || feature.upvotes || 0, // Keep existing upvotes if no new data
              }))
              .sort((a, b) => b.upvotes - a.upvotes),
          )
        }
      } catch (error) {
        console.error("Error fetching votes:", error)
        // Don't update state on error - keep existing data
      }
    }
    fetchVotes()
  }, [])

  // Sends an upvote to the backend and updates the UI
  const handleUpvote = async (id: number) => {
    if (localStorage.getItem(`voted-feature-${id}`)) {
      toast({
        title: "Already voted",
        description: "You have already voted for this feature!",
        variant: "destructive",
      })
      return
    }
    try {
      const response = await fetch("https://roadapi.mybuho.de/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature_id: id }),
      })
      if (!response.ok) throw new Error("Failed to upvote")
      const data = await response.json()
      setFeatures((prev) =>
        prev
          .map((feature) => (feature.id === id ? { ...feature, upvotes: data.upvotes } : feature))
          .sort((a, b) => b.upvotes - a.upvotes),
      )
      localStorage.setItem(`voted-feature-${id}`, "true")
      toast({
        title: "Vote recorded",
        description: `This feature now has ${data.upvotes} upvotes!`,
      })
    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Vote failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleShowQR = (lnurl: string) => {
    console.log("handleShowQR called with lnurl:", lnurl)
    setSelectedLnurl(lnurl)
    setQrModalOpen(true)
  }

  const handleCopyLNURL = async (lnurl: string) => {
    try {
      await navigator.clipboard.writeText(lnurl)
      toast({
        title: "LNURL Copied",
        description: "LNURL has been copied to your clipboard",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <SiteHeader />
      <HeroSection />
      <main className="container relative py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Feature Requests</h2>
              <p className="text-sm text-muted-foreground">Help shape the future by voting on features</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="w-fit">
                {featureList.length} features • sorted by votes
              </Badge>
              {isLoading && (
                <Badge variant="outline" className="w-fit animate-pulse">
                  Updating...
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {featureList.map((feature, index) => (
              <div key={feature.id} className="group relative">
                <Badge
                  variant="outline"
                  className={`absolute -left-2 -top-2 z-10 h-8 min-w-[2rem] border px-2 font-mono text-base 
                    ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : index === 1
                          ? "bg-gray-100 text-gray-700 border-gray-200"
                          : index === 2
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-muted text-muted-foreground"
                    }`}
                >
                  #{index + 1}
                </Badge>
                <FeatureCard
                  feature={feature}
                  onUpvote={handleUpvote}
                  onShowQR={handleShowQR}
                  onCopyLNURL={handleCopyLNURL}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
      <QRModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} lnurlp={selectedLnurl} />
    </>
  )
}

