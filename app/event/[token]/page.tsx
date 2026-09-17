import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle, AlertCircle, Info, Calendar } from 'lucide-react'
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Event</h2>
          <p className="text-gray-600 mb-6">This QR code does not match any known event.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    )
  }

  // 2. Check if event is active
  if (event.status !== 'active') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
          <Info className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Active</h2>
          <p className="text-gray-600 mb-6">This event is currently marked as {event.status}. Attendance is not being accepted at this time.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</Link>
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        {status === 'success' && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">✓ Attendance Completed</h2>
          </>
        )}
        
        {status === 'duplicate' && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Completed</h2>
            <p className="text-gray-500 mb-2">You have already marked attendance for this event.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">An Error Occurred</h2>
            <p className="text-gray-500 mb-2">We could not mark your attendance. Please try again.</p>
          </>
        )}

        <div className="bg-gray-50 p-4 rounded-lg my-6 text-left border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-2">{event.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{event.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Calendar className="mr-2 h-4 w-4" />
            Event Date: {new Date(event.event_date).toLocaleDateString()}
          </div>
          
          {(status === 'success' || status === 'duplicate') && (
            <div className="flex items-center text-sm text-gray-500 font-medium text-green-700 mt-3 pt-3 border-t border-gray-200">
              Recorded at: {attendanceTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <Link 
          href="/dashboard" 
          className="inline-flex justify-center w-full rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
