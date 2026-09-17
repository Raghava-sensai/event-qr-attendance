import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Calendar, Users, QrCode } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get events with attendance count
  // In Supabase, to get a count from a related table, we can do a joined select
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      attendances (count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Attendance Admin</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all events and their attendance statistics.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <Link
            href="/admin/missions"
            className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Manage Missions
          </Link>
          <Link
            href="/admin/events/new"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="flex items-center">
              <Plus className="mr-1 h-4 w-4" />
              Create Event
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events?.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{event.title}</h3>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  event.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                  event.status === 'ended' ? 'bg-gray-50 text-gray-600 ring-gray-500/10' :
                  'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                }`}>
                  {event.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                {new Date(event.event_date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Users className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                {event.attendances[0]?.count || 0} attendees
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-4 border-t border-gray-100">
              <Link href={`/admin/events/${event.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View Details
              </Link>
              <Link href={`/admin/events/${event.id}?qr=true`} className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center">
                <QrCode className="mr-1 h-4 w-4" />
                QR
              </Link>
            </div>
          </div>
        ))}

        {(!events || events.length === 0) && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            No events found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  )
}
