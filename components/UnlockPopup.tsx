'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'

export function UnlockPopup({ unlockedEvents }: { unlockedEvents: { id: string, title: string, unlock_xp: number }[] }) {
  const [newlyUnlocked, setNewlyUnlocked] = useState<{ id: string, title: string, unlock_xp: number }[]>([])

  useEffect(() => {
    if (unlockedEvents.length === 0) return

    // Get previously acknowledged events from localStorage
    const acknowledgedStr = localStorage.getItem('acknowledged_unlocked_events')
    const acknowledgedIds = acknowledgedStr ? JSON.parse(acknowledgedStr) : []

    // Find events that haven't been acknowledged yet
    const newEvents = unlockedEvents.filter(e => !acknowledgedIds.includes(e.id))
    
    if (newEvents.length > 0) {
      setNewlyUnlocked(newEvents)
      
      // Mark them as acknowledged so they don't pop up again
      const newAcknowledgedIds = [...acknowledgedIds, ...newEvents.map(e => e.id)]
      localStorage.setItem('acknowledged_unlocked_events', JSON.stringify(newAcknowledgedIds))
    }
  }, [unlockedEvents])

  if (newlyUnlocked.length === 0) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative border-2 border-[#E5C1FA] animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setNewlyUnlocked([])}
          className="absolute top-4 right-4 p-2 text-[#827893] hover:text-[#3B2D4A] hover:bg-[#F5F4F8] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-16 h-16 bg-[#EBE0F8] text-[#9D63D0] rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        
        <h3 className="text-2xl font-extrabold text-center text-[#3B2D4A] mb-2">
          New Stage Unlocked!
        </h3>
        
        <p className="text-center text-[#827893] mb-6">
          Your Aura XP just reached a new level. You have revealed {newlyUnlocked.length} secret event{newlyUnlocked.length > 1 ? 's' : ''}!
        </p>
        
        <div className="space-y-3 mb-8">
          {newlyUnlocked.map(event => (
            <div key={event.id} className="bg-[#F9F8FF] border border-[#EBE0F8] p-4 rounded-xl text-center">
              <div className="text-[10px] font-bold text-[#9D63D0] tracking-widest uppercase mb-1">
                Unlocked at {event.unlock_xp} XP
              </div>
              <div className="font-bold text-[#3B2D4A]">{event.title}</div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setNewlyUnlocked([])}
          className="w-full bg-[#E5C1FA] hover:bg-[#E5B5F5] transition-colors text-white rounded-2xl py-3.5 font-bold text-sm shadow-sm"
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}
