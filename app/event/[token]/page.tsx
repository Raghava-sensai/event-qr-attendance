import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle, AlertCircle, Info, Calendar, Trophy } from 'lucide-react'
import Link from 'next/link'

export default async function EventScanPage({
  params
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()

  // 1. Get event by token
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('qr_token', token)
    .single()

  if (eventError || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9] p-4">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lg text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#7A6A64] mb-2">Invalid Event</h2>
          <p className="text-[#A39189] mb-6">This QR code does not match any known event.</p>
          <Link href="/dashboard" className="text-[#D49A89] hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    )
  }

  // 2. Check if event is active
  if (event.status !== 'active') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9] p-4">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lg text-center">
          <Info className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#7A6A64] mb-2">Event Not Active</h2>
          <p className="text-[#A39189] mb-6">This event is currently marked as {event.status}. Check-ins are not being accepted at this time.</p>
          <Link href="/dashboard" className="text-[#D49A89] hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    )
  }

  // 3. Check session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // If not logged in, redirect to login with the next URL
    redirect(`/login?next=/event/${token}`)
  }

  // 4. Try to insert attendance (or check if already completed)
  let status: 'success' | 'duplicate' | 'error' = 'success'
  let attendanceTime = new Date()

  // First check if already attended
  const { data: existingAttendance } = await supabase
    .from('attendances')
    .select('scanned_at')
    .eq('event_id', event.id)
    .eq('user_id', user.id)
    .single()

  if (existingAttendance) {
    status = 'duplicate'
    attendanceTime = new Date(existingAttendance.scanned_at)
  } else {
    // Insert new attendance
    const { data: newAttendance, error: insertError } = await supabase
      .from('attendances')
      .insert({
        event_id: event.id,
        user_id: user.id
      })
      .select('scanned_at')
      .single()

    if (insertError) {
      if (insertError.code === '23505') { // Postgres unique_violation code
        status = 'duplicate'
      } else {
        status = 'error'
        console.error('Failed to mark attendance', insertError)
      }
    } else if (newAttendance) {
      attendanceTime = new Date(newAttendance.scanned_at)
    }
  }

  // 5. Check for mission unlock if successful
  let unlockedMilestone = null
  if (status === 'success') {
    // 1. Get all attendances to count categories
    const { data: allAttendances } = await supabase
      .from('attendances')
      .select(`
        events (category)
      `)
      .eq('user_id', user.id)

    let totalEvents = 0
    const categoryCounts: Record<string, number> = {}

    if (allAttendances) {
      allAttendances.forEach(a => {
        totalEvents++
        // @ts-expect-error join cast
        const category = a.events?.category || 'General'
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      })
    }

    // 2. Get all missions
    const { data: missions } = await supabase.from('missions').select('*')

    // 3. Find if any mission was JUST completed (its required count exactly matches the current count)
    if (missions) {
      unlockedMilestone = missions.find(mission => {
        const count = mission.target_category === 'All' ? totalEvents : (categoryCounts[mission.target_category] || 0)
        return count === mission.required_count
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9] p-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lg text-center">
        {status === 'success' && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#7A6A64] mb-2">✓ Check-in Complete</h2>
            
            {unlockedMilestone && (
              <div className="mt-6 mb-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-[2rem] p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center mb-2">
                  <span className="text-4xl animate-bounce">{unlockedMilestone.badge_icon}</span>
                </div>
                <h3 className="text-lg font-bold text-yellow-800">Mission Accomplished!</h3>
                <p className="font-semibold text-yellow-900 text-xl my-1">{unlockedMilestone.badge_name}</p>
                <p className="text-sm text-yellow-700">{unlockedMilestone.description}</p>
              </div>
            )}
          </>
        )}
        
        {status === 'duplicate' && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#7A6A64] mb-2">Already Checked In</h2>
            <p className="text-[#A39189] mb-2">You have already recorded your participation for this event.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#7A6A64] mb-2">An Error Occurred</h2>
            <p className="text-[#A39189] mb-2">We could not record your participation. Please try again.</p>
          </>
        )}

        <div className="bg-[#FFFDF9] p-4 rounded-lg my-6 text-left border border-[#F2E8DF]">
          <h3 className="text-lg font-semibold text-[#7A6A64] border-b pb-2 mb-2">{event.title}</h3>
          <p className="text-sm text-[#A39189] mb-4">{event.description}</p>
          
          <div className="flex items-center text-sm text-[#A39189] mb-1">
            <Calendar className="mr-2 h-4 w-4" />
            Event Date: {new Date(event.event_date).toLocaleDateString()}
          </div>
          
          {(status === 'success' || status === 'duplicate') && (
            <div className="flex items-center text-sm text-[#A39189] font-medium text-green-700 mt-3 pt-3 border-t border-[#F2E8DF]">
              Recorded at: {attendanceTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <Link 
          href="/dashboard" 
          className="inline-flex justify-center w-full rounded-2xl bg-[#FFE5D9] px-3 py-3 text-sm font-semibold text-[#D49A89] shadow-sm hover:bg-[#FFD1C1]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
