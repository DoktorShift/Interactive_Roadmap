import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Info, Users, ThumbsUp, Zap, Target, RefreshCw, Heart, MessageCircle, Sparkles, X } from "lucide-react"

export function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Info className="h-5 w-5" />
          <span className="sr-only">About this platform</span>
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to <span className="buho-gradient-text">Buho Roadmap</span>! 👋
          </DialogTitle>
          <DialogDescription className="pt-4">
            We&apos;re building something special for the Bitcoin community, and we&apos;d love your input!
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Updates every 10 minutes
          </Badge>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card className="h-full">
              <CardContent className="p-4">
                <FeatureItem
                  icon={<Users className="h-5 w-5" />}
                  title="Community-Driven Development"
                  description="We're enthusiasts building easy solutions for friends to join the Lightning Network. Your feedback shapes our priorities!"
                />
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent className="p-4">
                <FeatureItem
                  icon={<Target className="h-5 w-5" />}
                  title="Development Targets"
                  description="Some features have funding targets. This helps us allocate time and resources effectively, ensuring quality delivery."
                />
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent className="p-4">
                <FeatureItem
                  icon={<Sparkles className="h-5 w-5" />}
                  title="Feature Prioritization"
                  description="Features with more likes and support get prioritized. Help us focus on what matters most to the community!"
                />
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent className="p-4">
                <FeatureItem
                  icon={<ThumbsUp className="h-5 w-5" />}
                  title="Like Features"
                  description="Use upvotes to show interest in features. The more likes, the higher it ranks in our priority list."
                />
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent className="p-4">
                <FeatureItem
                  icon={<Zap className="h-5 w-5" />}
                  title="Lightning Support"
                  description="Contribute with Lightning payments to help cover development costs. Each sat helps us build faster!"
                />
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent className="p-4">
                <FeatureItem
                  icon={<MessageCircle className="h-5 w-5" />}
                  title="Comments via Zaps"
                  description="Every zap can include a comment! Share your thoughts when supporting a feature - all comments will be displayed on the feature card."
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex items-center justify-center border-t pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-primary" />
              <p>Built with love by Bitcoin enthusiasts. Your support means the world to us!</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

