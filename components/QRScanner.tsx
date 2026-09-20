'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useRouter } from 'next/navigation'

export default function QRScanner() {
  const router = useRouter()
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [hasAgreed, setHasAgreed] = useState(false)

  useEffect(() => {
    if (!hasAgreed) return;

    // Only initialize the scanner once agreed
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
  }, [router, scanResult, hasAgreed])

  if (!hasAgreed) {
    return (
      <div className="w-full max-w-sm mx-auto overflow-hidden rounded-[2rem] bg-white shadow-sm border border-[#EBE0F8] p-8 text-center">
        <div className="w-16 h-16 bg-[#EBE0F8] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#9D63D0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-extrabold text-[#3B2D4A] mb-2">Camera Access Required</h3>
        <p className="text-sm text-[#827893] mb-6">
          To scan QR codes and collect Aura XP, we need access to your device's camera.
        </p>
        <button 
          onClick={() => setHasAgreed(true)}
          className="w-full bg-[#EBE0F8] hover:bg-[#E0D0F5] transition-colors text-[#9D63D0] rounded-2xl py-3 px-4 font-bold text-sm shadow-sm"
        >
          Agree & Open Camera
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-[2rem] bg-white shadow-sm border border-[#EBE0F8]">
      <div id="qr-reader" className="w-full [&_button]:bg-[#EBE0F8] [&_button]:text-[#9D63D0] [&_button]:rounded-2xl [&_button]:px-4 [&_button]:py-2 [&_button]:font-bold [&_button]:text-sm [&_button]:mt-2"></div>
      {scanResult && (
        <div className="p-4 bg-green-50 text-green-700 text-center font-medium text-sm">
          Processing QR code...
        </div>
      )}
    </div>
  )
}
