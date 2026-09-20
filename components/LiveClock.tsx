'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export function LiveClock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const istTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
      setTime(`${istTime} IST`)
    }

    updateTime() // initial call
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!time) return null // return nothing during SSR

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-[#827893] bg-white/50 px-2.5 py-1 rounded-full border border-[#EBE0F8] backdrop-blur-sm shadow-sm">
      <Clock className="w-3.5 h-3.5 text-[#9D63D0]" />
      {time}
    </div>
  )
}
