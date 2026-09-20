'use client'

import { QRCodeSVG } from 'qrcode.react'

export function QRCodeDisplay({ url }: { url: string }) {
  return (
    <div className="bg-white p-4 rounded-[2rem] border border-[#EBE0F8] shadow-sm inline-block">
      <QRCodeSVG 
        value={url} 
        size={256}
        level="H"
        includeMargin={true}
        className="qr-code-svg mx-auto"
      />
    </div>
  )
}
