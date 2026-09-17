import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import QRScanner from '@/components/QRScanner'

export default function ScanPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Scan Event QR</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Point your camera at the QR code to check in and record your participation.
          </p>
        </div>

        <QRScanner />
      </div>
    </div>
  )
}
