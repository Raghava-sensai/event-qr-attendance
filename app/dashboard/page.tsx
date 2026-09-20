import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Camera, RefreshCw, Home, Gift, Sparkles, QrCode } from 'lucide-react'
import { LiveClock } from '@/components/LiveClock'

// Dashboard dynamically generates stages from events

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get user's profile for initials/avatar
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar')
    .eq('id', user.id)
    .single()

  const initials = profile?.username?.substring(0, 2).toUpperCase() || 'AQ'

  // Fetch all events to generate the timeline
  const { data: allEvents } = await supabase
    .from('events')
    .select('id, title, description, stage_label, tags, status')
    .order('event_date', { ascending: true })

  // Fetch attendances to calculate Aura XP
  const { data: attendances } = await supabase
    .from('attendances')
    .select('id, event_id, events(title, xp_value)')
    .eq('user_id', user.id)

  // Calculate Aura XP (summing up the xp_value of ALL event check-ins)
  let auraXP = 0
  attendances?.forEach(a => {
    // @ts-expect-error dynamic join
    auraXP += (a.events?.xp_value) || 1
  })

  const timelineEvents = allEvents?.filter(e => e.stage_label) || []
  const totalStations = timelineEvents.length > 0 ? timelineEvents.length : 4

  return (
    <div className="min-h-screen bg-[#F9F8FF] text-[#3B2D4A] pb-32 font-sans relative">
      <div className="max-w-md mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div 
          className="flex justify-between items-start mb-8 cursor-help"
          title="Student Dashboard: This is where participants see their Aura XP progress and upcoming journey stages based on their QR check-ins."
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="text-[10px] font-bold text-[#9D63D0] tracking-widest uppercase">
                SAGA × AURELIA
              </div>
              <LiveClock />
            </div>
            <h1 className="text-2xl font-extrabold text-[#3B2D4A] tracking-tight leading-tight">
              Welcome to Aurelia Fest!
            </h1>
            <p className="text-sm text-[#827893] mt-1">
              Feel · Flow · Flourish
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#EBE0F8] text-[#9D63D0] flex items-center justify-center font-bold text-lg shadow-sm">
            {profile?.avatar === '🦊' ? initials : profile?.avatar || initials}
          </div>
        </div>

        {/* Aura XP Card */}
        <div 
          className="bg-white rounded-[2rem] shadow-sm p-8 mb-10 flex flex-col items-center border border-[#EBE0F8] cursor-help"
          title="Aura XP Tracking: Every time you scan an event QR code, you gain 1 Aura XP. Watch the ring fill up as you visit more stations!"
        >
          
          {/* Progress Ring */}
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F3E5F5"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#E5C1FA"
                strokeWidth="8"
                strokeDasharray={`${Math.min(auraXP / 20, 1) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-[#3B2D4A]">{auraXP}</span>
              <span className="text-[10px] font-bold text-[#827893] uppercase tracking-wide mt-1">Aura XP</span>
            </div>
          </div>

          <h2 className="text-lg font-bold text-[#3B2D4A] mb-1">Let your aura glow!</h2>
          <p className="text-sm text-[#827893] mb-8">Reach 20 XP to maximize your Aura!</p>

          <div className="flex w-full gap-3">
            <Link 
              href="/dashboard/scan"
              className="flex-1 bg-[#EBE0F8] hover:bg-[#E0D0F5] transition-colors text-[#9D63D0] rounded-2xl py-3 px-4 flex items-center justify-center font-bold text-sm gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Simulate Scan
            </Link>
            <button className="flex-1 bg-[#F5F4F8] hover:bg-[#EAE8F0] transition-colors text-[#827893] rounded-2xl py-3 px-4 flex items-center justify-center font-bold text-sm gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Your Journey Section */}
        <div className="mb-6">
          <h3 className="text-sm font-extrabold text-[#827893] tracking-widest uppercase mb-6 ml-2">
            Your Journey
          </h3>

          <div className="relative pl-6 space-y-6">
            {/* Vertical Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-[#F2E8DF]"></div>

            {(() => {
              // Show events that have a stage_label defined OR events the user has attended
              const attendedEventIds = attendances?.map(a => a.event_id) || []
              const timelineEvents = allEvents?.filter(e => e.stage_label || attendedEventIds.includes(e.id)) || []
              
              if (timelineEvents.length === 0) {
                return (
                  <div className="text-sm text-[#827893] italic bg-white rounded-[2rem] p-6 shadow-sm border border-[#EBE0F8]">
                    No stages have been defined by the admin yet, and you haven't scanned any QR codes.
                  </div>
                )
              }

              return timelineEvents.map((stage, i) => {
                const done = attendances?.some(a => a.event_id === stage.id)
                // Split comma separated tags into array
                const pills = stage.tags ? stage.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
                
                return (
                  <div key={stage.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[29px] top-4 w-3 h-3 rounded-full border-2 border-white ${done ? 'bg-[#E5C1FA]' : 'bg-[#EBE0F8]'}`}></div>
                    
                    {/* Stage Card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#EBE0F8]">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-[10px] font-bold text-[#9D63D0] tracking-widest uppercase">
                          {stage.stage_label || 'Hidden Stage Unlocked!'}
                        </div>
                        <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${done ? 'bg-[#D1F2D1] text-[#2E7D32]' : 'bg-[#F5F4F8] text-[#9D63D0]'}`}>
                          {done ? 'Done' : 'To do'}
                        </div>
                      </div>
                      <h4 className="text-xl font-extrabold text-[#3B2D4A] mb-2">{stage.title}</h4>
                      <p className="text-sm text-[#827893] leading-relaxed mb-4">
                        {stage.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pills.map((pill: string) => (
                          <span key={pill} className="bg-[#F5F4F8] text-[#827893] text-xs font-bold px-3 py-1.5 rounded-full">
                            {pill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Whisker Wall Photobooth Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm mt-8 border border-[#EBE0F8]">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#C7B9F1] flex items-center justify-center flex-shrink-0 text-2xl">
              🐱
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-[#3B2D4A] mb-1 leading-tight">The Whisker Wall & Photobooth</h4>
              <p className="text-sm text-[#827893] leading-relaxed">
                Say hi to our hand-painted cat mascot, snap a photo, and leave a little review.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Link 
              href="/dashboard/scan"
              className="w-full bg-[#E5C1FA] hover:bg-[#E5B5F5] transition-colors text-white rounded-2xl py-3.5 flex items-center justify-center font-bold text-sm gap-2"
            >
              <Camera className="w-4 h-4" />
              Scan the Whisker Wall code
            </Link>
            <Link 
              href="/dashboard/review"
              className="w-full bg-[#F5F4F8] hover:bg-[#EAE8F0] transition-colors text-[#9D63D0] rounded-2xl py-3.5 flex items-center justify-center font-bold text-sm gap-2"
            >
              Leave a Review
            </Link>
          </div>
        </div>

      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 pointer-events-none z-50">
        <div className="bg-white rounded-full shadow-lg border border-[#EBE0F8] px-8 py-3 flex items-center justify-between w-full max-w-sm pointer-events-auto relative">
          
          <button className="flex flex-col items-center gap-1 text-[#827893] hover:text-[#9D63D0]">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          {/* Center floating scan button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#FFD1C1] to-[#FFB7B2] rounded-full shadow-md flex items-center justify-center border-4 border-[#FFFDF9]">
              <Link href="/dashboard/scan">
                <QrCode className="w-6 h-6 text-[#9D63D0]" />
              </Link>
            </div>
          </div>

          <button className="flex flex-col items-center gap-1 text-[#827893] hover:text-[#9D63D0]">
            <Gift className="w-5 h-5" />
            <span className="text-[10px] font-bold">Rewards</span>
          </button>

        </div>
      </div>

    </div>
  )
}
