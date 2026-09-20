'use client'

import { QRCodeSVG } from 'qrcode.react'

export function QRCodeDisplay({ url }: { url: string }) {
  return (
    <div className="bg-white p-4 rounded-[2rem] border border-[#F2E8DF] shadow-sm inline-block">
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
