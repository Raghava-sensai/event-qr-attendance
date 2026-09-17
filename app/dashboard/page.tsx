import { createClient } from '@/lib/supabase/server'
import { Calendar, CheckCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout handles redirect
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  // Get attended events
  const { data: attendances, error } = await supabase
    .from('attendances')
    .select(`
      id,
      scanned_at,
      events (
        id,
        title,
        description,
        event_date
      )
    `)
    .eq('user_id', user.id)
    .order('scanned_at', { ascending: false })

  if (error) {
    console.error('Error fetching attendances:', error)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Welcome, {profile?.username || 'User'}!</h1>
        <p className="mt-2 text-sm text-gray-700">
          Here is a list of all the events you have attended.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium leading-6 text-gray-900">My Events</h2>
        </div>
        
        <ul role="list" className="divide-y divide-gray-200">
          {attendances?.map((attendance) => (
            <li key={attendance.id} className="px-6 py-6 sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center sm:w-full">
                <div className="mt-4 sm:mt-0 sm:flex-auto">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {/* @ts-expect-error Types from Supabase join need casting */}
                      {attendance.events?.title}
                    </h3>
                  </div>
                  <div className="mt-2 sm:flex sm:items-center gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {/* @ts-expect-error Types from Supabase join need casting */}
                      {new Date(attendance.events?.event_date).toLocaleDateString()}
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
                      Completed at {new Date(attendance.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}

          {(!attendances || attendances.length === 0) && (
            <li className="px-6 py-12 text-center text-gray-500">
              You have not attended any events yet. Scan an event QR code to get started!
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
