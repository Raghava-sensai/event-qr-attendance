import { createClient } from '@/lib/supabase/server'
import { Calendar, CheckCircle, QrCode, Trophy, Target, Award } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
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
    .select('id, title, description, event_date, status, category')
    .in('status', ['active', 'upcoming'])
    .order('event_date', { ascending: true })

  // Get participated events
  const { data: attendances } = await supabase
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
        status,
        category
      )
    `)
    .eq('user_id', user.id)
    .order('scanned_at', { ascending: false })

  // Get missions
  const { data: missions } = await supabase
    .from('missions')
    .select('*')
    .order('created_at', { ascending: true })

  // Filter available events
  const participatedEventIds = new Set(attendances?.map(a => a.event_id) || [])
  const availableEvents = allEvents?.filter(e => !participatedEventIds.has(e.id)) || []

  // Calculate mission progress
  const userCategoryCounts: Record<string, number> = {}
  let totalEvents = 0
  
  if (attendances) {
    attendances.forEach(a => {
      totalEvents++
      // @ts-expect-error Types from Supabase join need casting
      const category = a.events?.category || 'General'
      userCategoryCounts[category] = (userCategoryCounts[category] || 0) + 1
    })
  }

  type MissionProgress = {
    id: string
    name: string
    description: string
    target_category: string
    required_count: number
    badge_name: string
    badge_icon: string
    currentProgress: number
    percentage: number
  }

  const activeMissions: MissionProgress[] = []
  const completedMissions: MissionProgress[] = []

  if (missions) {
    missions.forEach(mission => {
      let progress = 0
      if (mission.target_category === 'All') {
        progress = totalEvents
      } else {
        progress = userCategoryCounts[mission.target_category] || 0
      }

      const isCompleted = progress >= mission.required_count
      const missionData = {
        ...mission,
        currentProgress: Math.min(progress, mission.required_count),
        percentage: Math.min(100, (progress / mission.required_count) * 100)
      }

      if (isCompleted) {
        completedMissions.push(missionData)
      } else {
        activeMissions.push(missionData)
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Welcome, {profile?.username || 'Student'}!</h1>
          <p className="mt-2 text-sm text-gray-700">
            Check in to events and complete missions to earn badges.
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

      {/* Badges Section */}
      {completedMissions.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-yellow-500" />
            My Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            {completedMissions.map(mission => (
              <div key={mission.id} className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 px-4 py-3 rounded-lg shadow-sm">
                <span className="text-3xl">{mission.badge_icon}</span>
                <div>
                  <div className="font-bold text-yellow-900 text-sm">{mission.badge_name}</div>
                  <div className="text-xs text-yellow-700">{mission.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Missions Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-blue-50 rounded-full opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-blue-500" />
            Active Missions
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeMissions.length > 0 ? (
              activeMissions.map(mission => (
                <div key={mission.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{mission.name}</h3>
                    <span className="text-2xl" title={`Reward: ${mission.badge_name}`}>{mission.badge_icon}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2">{mission.description}</p>
                  
                  <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-1">
                    <span>{mission.currentProgress} / {mission.required_count} Events</span>
                    <span>{Math.round(mission.percentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${mission.percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                    Category: {mission.target_category}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500 italic">
                {missions && missions.length > 0 ? "You've completed all active missions!" : "No missions available right now."}
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
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {event.category}
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
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {/* @ts-expect-error Types from Supabase join need casting */}
                          {attendance.events?.category}
                        </span>
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
