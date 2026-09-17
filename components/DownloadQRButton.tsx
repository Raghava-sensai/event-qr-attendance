'use client'

import { Download } from 'lucide-react'

export default function DownloadQRButton({ eventName }: { eventName: string }) {
  const downloadQR = () => {
    // Find the SVG element in the document
    const svgElement = document.querySelector('svg.qr-code-svg')
    
    if (!svgElement) {
      alert("QR code not found")
      return
    }

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    
    const downloadLink = document.createElement("a")
    downloadLink.href = url
    downloadLink.download = `${eventName.replace(/\s+/g, '-').toLowerCase()}-qr.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <button 
      onClick={downloadQR}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
    >
      <Download className="h-4 w-4" />
      Download QR SVG
    </button>
  )
}
