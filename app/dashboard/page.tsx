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
    .select('id, event_id, events(title)')
    .eq('user_id', user.id)

  // Calculate Aura XP (counting ALL event check-ins)
  const timelineEvents = allEvents?.filter(e => e.stage_label) || []
  const auraXP = attendances?.length || 0
  const totalStations = timelineEvents.length > 0 ? timelineEvents.length : 4

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#7A6A64] pb-32 font-sans relative">
      <div className="max-w-md mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div 
          className="flex justify-between items-start mb-8 cursor-help"
          title="Student Dashboard: This is where participants see their Aura XP progress and upcoming journey stages based on their QR check-ins."
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="text-[10px] font-bold text-[#D49A89] tracking-widest uppercase">
                SAGA × AURELIA
              </div>
              <LiveClock />
            </div>
            <h1 className="text-2xl font-extrabold text-[#7A6A64] tracking-tight leading-tight">
              Welcome to Aurelia Fest!
            </h1>
            <p className="text-sm text-[#A39189] mt-1">
              Feel · Flow · Flourish
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FFE5D9] text-[#D49A89] flex items-center justify-center font-bold text-lg shadow-sm">
            {profile?.avatar === '🦊' ? initials : profile?.avatar || initials}
          </div>
        </div>

        {/* Aura XP Card */}
        <div 
          className="bg-white rounded-[2rem] shadow-sm p-8 mb-10 flex flex-col items-center border border-[#F2E8DF] cursor-help"
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
                stroke="#F2E8DF"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#FFD1C1"
                strokeWidth="8"
                strokeDasharray={`${(auraXP / totalStations) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-[#7A6A64]">{auraXP}</span>
              <span className="text-[10px] font-bold text-[#A39189] uppercase tracking-wide mt-1">Aura XP</span>
            </div>
          </div>

          <h2 className="text-lg font-bold text-[#7A6A64] mb-1">Let your aura glow!</h2>
          <p className="text-sm text-[#A39189] mb-8">{auraXP} of {totalStations} stations visited</p>

          <div className="flex w-full gap-3">
            <Link 
              href="/dashboard/scan"
              className="flex-1 bg-[#FFE5D9] hover:bg-[#FFD1C1] transition-colors text-[#D49A89] rounded-2xl py-3 px-4 flex items-center justify-center font-bold text-sm gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Simulate Scan
            </Link>
            <button className="flex-1 bg-[#FFF9F5] hover:bg-[#F2E8DF] transition-colors text-[#A39189] rounded-2xl py-3 px-4 flex items-center justify-center font-bold text-sm gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Your Journey Section */}
        <div className="mb-6">
          <h3 className="text-sm font-extrabold text-[#A39189] tracking-widest uppercase mb-6 ml-2">
            Your Journey
          </h3>

          <div className="relative pl-6 space-y-6">
            {/* Vertical Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-[#F2E8DF]"></div>

            {(() => {
              // Only show events that have a stage_label defined
              const timelineEvents = allEvents?.filter(e => e.stage_label) || []
              
              if (timelineEvents.length === 0) {
                return (
                  <div className="text-sm text-[#A39189] italic bg-white rounded-[2rem] p-6 shadow-sm border border-[#F2E8DF]">
                    No stages have been defined by the admin yet.
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
                    <div className={`absolute -left-[29px] top-4 w-3 h-3 rounded-full border-2 border-white ${done ? 'bg-[#FFD1C1]' : 'bg-[#F2E8DF]'}`}></div>
                    
                    {/* Stage Card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#F2E8DF]">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-[10px] font-bold text-[#D49A89] tracking-widest uppercase">
                          {stage.stage_label}
                        </div>
                        <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${done ? 'bg-[#E2F0CB] text-[#71965A]' : 'bg-[#FFF9F5] text-[#D49A89]'}`}>
                          {done ? 'Done' : 'To do'}
                        </div>
                      </div>
                      <h4 className="text-xl font-extrabold text-[#7A6A64] mb-2">{stage.title}</h4>
                      <p className="text-sm text-[#A39189] leading-relaxed mb-4">
                        {stage.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pills.map((pill: string) => (
                          <span key={pill} className="bg-[#FFF9F5] text-[#A39189] text-xs font-bold px-3 py-1.5 rounded-full">
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
        <div className="bg-white rounded-[2rem] p-6 shadow-sm mt-8 border border-[#F2E8DF]">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#FFDAC1] flex items-center justify-center flex-shrink-0 text-2xl">
              🐱
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-[#7A6A64] mb-1 leading-tight">The Whisker Wall & Photobooth</h4>
              <p className="text-sm text-[#A39189] leading-relaxed">
                Say hi to our hand-painted cat mascot, snap a photo, and leave a little review.
              </p>
            </div>
          </div>
          <Link 
            href="/dashboard/scan"
            className="w-full bg-[#FFD1C1] hover:bg-[#FFB7B2] transition-colors text-[#D49A89] rounded-2xl py-3.5 flex items-center justify-center font-bold text-sm gap-2"
          >
            <Camera className="w-4 h-4" />
            Scan the Whisker Wall code
          </Link>
        </div>

      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 pointer-events-none z-50">
        <div className="bg-white rounded-full shadow-lg border border-[#F2E8DF] px-8 py-3 flex items-center justify-between w-full max-w-sm pointer-events-auto relative">
          
          <button className="flex flex-col items-center gap-1 text-[#A39189] hover:text-[#D49A89]">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          {/* Center floating scan button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#FFD1C1] to-[#FFB7B2] rounded-full shadow-md flex items-center justify-center border-4 border-[#FFFDF9]">
              <Link href="/dashboard/scan">
                <QrCode className="w-6 h-6 text-[#D49A89]" />
              </Link>
            </div>
          </div>

          <button className="flex flex-col items-center gap-1 text-[#A39189] hover:text-[#D49A89]">
            <Gift className="w-5 h-5" />
            <span className="text-[10px] font-bold">Rewards</span>
          </button>

        </div>
      </div>

    </div>
  )
}
