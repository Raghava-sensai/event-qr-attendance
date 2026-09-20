'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function MissionPopup({ mission }: { mission: any }) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen || !mission) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative border-2 border-yellow-300 animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#827893] hover:text-[#3B2D4A] hover:bg-[#F5F4F8] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center justify-center mx-auto mb-4 animate-bounce">
          {mission.badge_icon?.startsWith('http') ? (
            <img src={mission.badge_icon} alt="Badge" className="h-24 w-24 object-contain" />
          ) : (
            <span className="text-6xl">{mission.badge_icon}</span>
          )}
        </div>
        
        <h3 className="text-2xl font-extrabold text-center text-yellow-600 mb-2">
          Mission Accomplished!
        </h3>
        
        <p className="font-semibold text-center text-yellow-900 text-xl my-2">{mission.badge_name}</p>
        
        <p className="text-center text-[#827893] mb-6">
          {mission.description}
        </p>
        
        <button 
          onClick={() => setIsOpen(false)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 transition-colors text-yellow-950 rounded-2xl py-3.5 font-bold text-sm shadow-sm"
        >
          Collect Badge
        </button>
      </div>
    </div>
  )
}
