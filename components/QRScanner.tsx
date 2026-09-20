'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useRouter } from 'next/navigation'

export default function QRScanner() {
  const router = useRouter()
  const [scanResult, setScanResult] = useState<string | null>(null)

  useEffect(() => {
    // Only initialize the scanner once
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    )

    function onScanSuccess(decodedText: string) {
      if (scanResult) return // Prevent multiple triggers

      setScanResult(decodedText)
      // Check if it's a URL or just a token
      try {
        const url = new URL(decodedText)
        if (url.pathname.startsWith('/event/')) {
          router.push(url.pathname) // Redirect to the event token page
        } else {
          router.push(decodedText) // Unrecognized URL, just try to go to it
        }
      } catch (e) {
        // If it's not a URL, maybe it's just the token?
        router.push(`/event/${decodedText}`)
      }
      
      // Stop scanning once successful
      scanner.clear().catch(console.error)
    }

    function onScanFailure(error: any) {
      // Typically just "not found" frame errors, ignore
    }

    scanner.render(onScanSuccess, onScanFailure)

    return () => {
      // Cleanup when unmounting
      scanner.clear().catch(console.error)
    }
  }, [router, scanResult])

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-[2rem] bg-white shadow-sm border border-[#F2E8DF]">
      <div id="qr-reader" className="w-full"></div>
      {scanResult && (
        <div className="p-4 bg-green-50 text-green-700 text-center font-medium text-sm">
          Processing QR code...
        </div>
      )}
    </div>
  )
}
