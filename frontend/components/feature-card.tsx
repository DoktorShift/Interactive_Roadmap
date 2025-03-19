"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThumbsUp, Zap, Copy, ExternalLink, MessageCircle, ChevronDown, Sparkles } from "lucide-react"
import { useState } from "react"
import type { Feature } from "@/types"

interface FeatureCardProps {
  feature: Feature
  onUpvote: (id: number) => void
  onShowQR: (lnurlp: string) => void
  onCopyLNURL: (lnurlp: string) => void
}

export function FeatureCard({ feature, onUpvote, onShowQR, onCopyLNURL }: FeatureCardProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  const statusColors = {
    Idea: "bg-red-100 text-red-700 border-red-200",
    Planned: "bg-orange-100 text-orange-700 border-orange-200",
    Progress: "bg-green-100 text-green-800 border-green-200",
    Launched: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }

  const progress = (feature.donationTotal / feature.target) * 100

  return (
    <Card className="feature-card overflow-hidden">
      <CardHeader className="space-y-3 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{feature.name}</h3>
              <Badge variant="secondary" className={statusColors[feature.status]}>
                {feature.status}
              </Badge>
            </div>
            <div className="relative">
              <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                <CollapsibleContent className={!isDescriptionOpen ? "line-clamp-2" : undefined}>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CollapsibleContent>
                {feature.description.length > 150 && (
                  <div className="relative">
                    {!isDescriptionOpen && (
                      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                      className="mt-1 h-auto p-0 text-primary hover:text-primary/80"
                    >
                      {isDescriptionOpen ? "Show less" : "Read more"}
                    </Button>
                  </div>
                )}
              </Collapsible>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Funding Progress</span>
            <span className="font-medium">
              {feature.donationTotal} / {feature.target} sats
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid gap-3">
          {/* Primary Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onUpvote(feature.id)}
              className="flex-1 bg-secondary/50 hover:bg-secondary"
            >
              <ThumbsUp className="mr-2 h-5 w-5" />
              <span className="font-semibold">{feature.upvotes}</span>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => onShowQR(feature.lnurl)}
                    className="flex-1 group relative bg-primary/90 hover:bg-primary"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Support
                    <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-yellow-200 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Support this feature with Lightning ⚡️</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onCopyLNURL(feature.lnurl)}
              className="flex-1 bg-background"
            >
              <Copy className="mr-2 h-5 w-5" />
              Copy LNURL
            </Button>
            <Button variant="outline" size="lg" asChild className="flex-1 bg-background">
              <a href={`lightning:${feature.lnurl}`} target="_blank" rel="noreferrer noopener">
                <ExternalLink className="mr-2 h-5 w-5" />
                Open in Wallet
              </a>
            </Button>
          </div>

          {/* Comments Section */}
          <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments ({feature.comments.length})
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isCommentsOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 px-4 py-2">
              {feature.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No comments yet. Support this feature and leave a comment!
                </p>
              ) : (
                feature.comments.map((comment, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    <p>"{comment.substring(0, 200).replace(/[^\w\s]/g, "")}"</p>
                    <span className="mt-1 block text-xs">Just now</span>
                  </div>
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  )
}

