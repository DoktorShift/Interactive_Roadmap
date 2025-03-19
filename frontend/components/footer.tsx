"use client"

import { Github, Twitter, FileText, Map, Check, Copy, Zap, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const npubAddress = "npub17c2szua46mc8ndp4grvy4z5465x0qxjge8tqx7vyu0vkqr24y2hssuuy6f"

  return (
    <footer className="bg-gray-300/30 py-8 px-2">
      <div className="container mx-auto px-4">
        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 justify-items-center justify-center text-center max-w-4xl mx-auto">
          {/* Resources */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-3">Resources</h3>
            <div className="flex flex-col items-center space-y-2">
              <a
                href="https://roadmap.mybuho.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors flex items-center justify-center text-sm"
              >
                <Map className="h-4 w-4 mr-2" />
                <span>Roadmap</span>
              </a>
              <a
                href="https://docs.mybuho.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors flex items-center justify-center text-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>Documentation</span>
              </a>
            </div>
          </div>

          {/* Contribute */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-3">Contribute</h3>
            <a
              href="https://buho.canny.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-primary transition-colors flex items-center text-sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Submit Feedback</span>
            </a>
          </div>

          {/* Connect */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-3">Connect</h3>
            <div className="flex flex-col items-center space-y-2">
              <a
                href="https://twitter.com/drshift3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors flex items-center justify-center text-sm"
              >
                <Twitter className="h-4 w-4 mr-2" />
                <span>@drshift3</span>
              </a>
              <a
                href="https://github.com/DoktorShift"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors flex items-center justify-center text-sm"
              >
                <Github className="h-4 w-4 mr-2" />
                <span>DoktorShift</span>
              </a>
              <div className="text-gray-700 flex items-center justify-center text-sm relative">
                <div className="mr-2 relative w-4 h-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nostr_schwarz-Ll5Nm68IJyTAV7FjtoKML30iOX36sq.gif"
                    alt="Nostr"
                    width={16}
                    height={16}
                  />
                </div>
                <span
                  className="font-mono text-xs truncate max-w-[150px] cursor-pointer flex items-center hover:text-primary transition-colors"
                  onClick={() => copyToClipboard(npubAddress)}
                  title="Click to copy"
                >
                  {npubAddress.substring(0, 12)}...{npubAddress.substring(npubAddress.length - 8)}
                  {copied ? (
                    <Check className="h-3 w-3 ml-1 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3 ml-1 opacity-70" />
                  )}
                </span>
                {copied && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white px-2 py-1 rounded text-xs whitespace-nowrap animate-fade-in-out">
                    Npub copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300/30 mb-6"></div>

        {/* Logo and Brand - Now at the bottom */}
        <div className="flex items-center justify-center space-x-2 mb-4 text-center">
          <Image
            src="https://raw.githubusercontent.com/DoktorShift/images/main/buho_logo.png"
            alt="Buho Logo"
            width={28}
            height={28}
            className="mr-2"
          />
          <span className="text-xl font-bold buho-gradient-text">BuhoGO</span>
          <span className="text-gray-700 text-sm ml-2">
            | created by{" "}
            <a
              href="https://github.com/DoktorShift"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Dr.Shift
            </a>{" "}
            | pwrd by{" "}
            <a
              href="https://github.com/DoktorShift/Buho_GO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YOU
            </a>
          </span>
        </div>

        {/* Wallet CTA */}
        <div className="text-center mt-4">
          <p className="text-gray-700 text-xs">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <Zap className="mr-1 h-3 w-3" />
              Get Started
            </span>{" "}
            Create your own Buho wallet today!{" "}
            <a
              href="https://wallet.mybuho.de"
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noreferrer"
            >
              wallet.mybuho.de
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

