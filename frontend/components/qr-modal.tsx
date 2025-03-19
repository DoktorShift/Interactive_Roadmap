"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Loader2 } from "lucide-react"

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  lnurlp?: string | null
  lnurl?: string | null
}

export function QRModal({ isOpen, onClose, lnurlp, lnurl }: QRModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  // Use either lnurlp or lnurl, with lnurl taking precedence
  const qrValue = lnurl || lnurlp

  useEffect(() => {
    console.log("QRModal effect triggered. isOpen:", isOpen, "qrValue:", qrValue)

    if (isOpen && qrValue) {
      setIsLoading(true)
      setError(null)
      setQrDataUrl(null)

      const formattedValue =
        qrValue.startsWith("http") || qrValue.startsWith("lightning:") ? qrValue : `lightning:${qrValue}`

      console.log("Generating QR code for value:", formattedValue)

      QRCode.toDataURL(formattedValue, {
        width: 250,
        margin: 4,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      })
        .then((url) => {
          console.log("QR code generated successfully")
          setQrDataUrl(url)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("QR Code generation error:", err)
          setError("Failed to generate QR code: " + err.message)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [isOpen, qrValue])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-6 max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Lightning Payment QR</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center min-h-[250px] w-full">
          {isLoading && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating QR code...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-destructive">
              <p>{error}</p>
              <p className="text-sm text-muted-foreground mt-2">Try copying the LNURL instead</p>
            </div>
          )}

          {qrDataUrl && <img src={qrDataUrl || "/placeholder.svg"} alt="QR Code" className="mx-auto" />}

          {!isLoading && !error && qrValue && (
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Scan with your Lightning wallet to support this feature
            </p>
          )}

          {/* Fallback display for LNURL value */}
          {!isLoading && qrValue && (
            <p className="mt-4 text-xs text-center text-muted-foreground break-all">LNURL: {qrValue}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

