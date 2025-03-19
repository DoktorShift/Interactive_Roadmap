import { InfoDialog } from "@/components/info-dialog"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

const navigation = [
  { name: "Wallet", href: "https://wallet.mybuho.de" },
  { name: "GitHub", href: "https://github.com/DoktorShift" },
  { name: "Docs", href: "https://docs.mybuho.de" },
  { name: "FAQ", href: "https://docs.mybuho.de/guide/faq" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="https://mybuho.de" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Image
              src="https://raw.githubusercontent.com/DoktorShift/images/main/buho_logo.png"
              alt="Buho"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold">
              <span className="buho-gradient-text">Buho</span> Roadmap
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <nav className="flex gap-4">
            {navigation.map((item) => (
              <Button key={item.name} variant="ghost" asChild>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-foreground"
                >
                  {item.name}
                </a>
              </Button>
            ))}
          </nav>
          <div className="flex items-center gap-2 border-l pl-4">
            <InfoDialog />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <InfoDialog />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[280px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 text-lg hover:text-primary"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

