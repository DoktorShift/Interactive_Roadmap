import { ArrowRight, Heart, Target, Users } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-b from-background to-secondary/20">
      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Shape the Future of <span className="buho-gradient-text">Buho Wallet</span>
            </h1>
            <p className="mt-6 max-w-[600px] text-lg text-muted-foreground sm:text-xl">
              Join our community-driven development journey. Your feedback and support directly influence which features
              we build next.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:max-w-[500px]">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Community First</h3>
                  <p className="text-sm text-muted-foreground">Built with and for our community</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Clear Goals</h3>
                  <p className="text-sm text-muted-foreground">Transparent development targets</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Open Participation</h3>
                  <p className="text-sm text-muted-foreground">Everyone can contribute</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Rapid Progress</h3>
                  <p className="text-sm text-muted-foreground">Continuous improvements</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl" />
            <div className="relative space-y-4 p-6">
              <div className="rounded-lg bg-background/80 backdrop-blur p-4 shadow-sm">
                <h3 className="font-medium">Latest Achievement</h3>
                <p className="text-sm text-muted-foreground">Successfully launched wallet integration</p>
              </div>
              <div className="rounded-lg bg-background/80 backdrop-blur p-4 shadow-sm">
                <h3 className="font-medium">Documentation</h3>
                <p className="text-sm text-muted-foreground">Explore our guides at docs.mybuho.de</p>
              </div>
              <div className="rounded-lg bg-background/80 backdrop-blur p-4 shadow-sm">
                <h3 className="font-medium">Next Milestone</h3>
                <p className="text-sm text-muted-foreground">Native mobile app development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

