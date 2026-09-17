import { createClient } from '@/lib/supabase/server'
import { Calendar, CheckCircle, QrCode, Trophy, Target } from 'lucide-react'
import Link from 'next/link'
import { getProgressStats } from '@/lib/constants/milestones'

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

  // Get all active and upcoming events
  const { data: allEvents, error: eventsError } = await supabase
    .from('events')
    .select('id, title, description, event_date, status')
    .in('status', ['active', 'upcoming'])
    .order('event_date', { ascending: true })

  if (eventsError) {
    console.error('Error fetching events:', eventsError)
  }

  // Get participated events
  const { data: attendances, error: attendancesError } = await supabase
    .from('attendances')
    .select(`
      id,
      scanned_at,
      event_id,
      events (
        id,
        title,
        description,
        event_date,
        status
      )
    `)
    .eq('user_id', user.id)
    .order('scanned_at', { ascending: false })

  if (attendancesError) {
    console.error('Error fetching attendances:', attendancesError)
  }

  // Filter available events (events the user hasn't participated in yet)
  const participatedEventIds = new Set(attendances?.map(a => a.event_id) || [])
  const availableEvents = allEvents?.filter(e => !participatedEventIds.has(e.id)) || []

  const participationCount = attendances?.length || 0
  const stats = getProgressStats(participationCount)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Welcome, {profile?.username || 'Student'}!</h1>
          <p className="mt-2 text-sm text-gray-700">
            Check in to events and track your club participation.
          </p>
        </div>
        <Link 
          href="/dashboard/scan" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
        >
          <QrCode className="h-5 w-5" />
          Scan QR
        </Link>
      </div>

      {/* Progress Bar Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-blue-50 rounded-full opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Club Participation
            </h2>
            <div className="text-sm font-medium text-gray-500">
              {participationCount} {stats.nextMilestone ? `/ ${stats.nextMilestone.requiredEvents}` : ''} events participated
            </div>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${stats.progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              {stats.currentMilestone ? (
                <>
                  <span className="text-2xl">{stats.currentMilestone.icon}</span>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Level</div>
                    <div className="font-bold text-gray-900">{stats.currentMilestone.name}</div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 italic">Attend your first event to unlock a badge!</div>
              )}
            </div>
            
            {stats.nextMilestone && (
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <Target className="h-4 w-4 text-gray-400" />
                <div className="text-right">
                  <div className="text-xs text-gray-500">Next milestone</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {stats.nextMilestone.icon} {stats.nextMilestone.name}
                  </div>
                </div>
                <div className="ml-2 pl-3 border-l border-gray-200">
                  <div className="font-bold text-blue-600">{stats.eventsToNext}</div>
                  <div className="text-xs text-gray-500">more</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Available Events Section */}
      <section>
        <h2 className="text-xl font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
          <span>🎫</span> Upcoming Club Events
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {availableEvents.length > 0 ? (
              availableEvents.map((event) => (
                <li key={event.id} className="px-6 py-6 sm:flex sm:items-center sm:justify-between hover:bg-gray-50 transition-colors">
                  <div className="sm:flex sm:items-center sm:w-full">
                    <div className="sm:flex-auto">
                      <div className="flex items-center justify-between sm:justify-start gap-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {event.title}
                        </h3>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          event.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                        }`}>
                          {event.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <Link 
                        href="/dashboard/scan"
                        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm"
                      >
                        <QrCode className="h-4 w-4" />
                        Scan QR
                      </Link>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-12 text-center text-gray-500">
                No upcoming events available at the moment. Check back later!
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Participated Events Section */}
      <section>
        <h2 className="text-xl font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
          <span>✓</span> My Participated Events
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {attendances && attendances.length > 0 ? (
              attendances.map((attendance) => (
                <li key={attendance.id} className="px-6 py-6 sm:flex sm:items-center sm:justify-between">
                  <div className="sm:flex sm:items-center sm:w-full">
                    <div className="sm:flex-auto">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
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
                          Checked in: {new Date(attendance.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className="mt-2 sm:mt-0 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          ✓ Participated
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-12 text-center text-gray-500">
                You haven't checked into any events yet. Scan a QR code to record your participation!
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  )
}
