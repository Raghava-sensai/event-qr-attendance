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
      <div 
        className="sm:flex sm:items-center cursor-help"
        title="Admin Dashboard: Here you can view all event QR codes, check who has scanned them, and set up Badge Rules."
      >
        <div className="sm:flex-auto">
          <div className="text-[10px] font-bold text-[#9D63D0] tracking-widest mb-1 uppercase">SAGA × AURELIA</div>
          <h1 className="text-2xl font-extrabold leading-6 text-[#3B2D4A]">Attendance Admin</h1>
          <p className="mt-2 text-sm text-[#827893]">
            A list of all events and their attendance statistics.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex flex-wrap gap-3">
          <Link
            href="/admin/settings"
            className="block rounded-2xl bg-[#F9F8FF] px-4 py-2 text-center text-sm font-bold text-[#827893] shadow-sm ring-1 ring-inset ring-[#EBE0F8] hover:bg-[#F5F4F8]"
            title="Configure the global admin Gmail for reviews"
          >
            <span className="flex items-center">
              Global Settings
            </span>
          </Link>
          <Link
            href="/admin/missions"
            className="block rounded-2xl bg-white px-4 py-2 text-center text-sm font-bold text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] hover:bg-[#F5F4F8]"
            title="Configure how many Aura XP points or category check-ins are required to unlock Badges"
          >
            Manage Badge Rules
          </Link>
          <Link
            href="/admin/events/new"
            className="block rounded-2xl bg-[#EBE0F8] px-4 py-2 text-center text-sm font-bold text-[#9D63D0] shadow-sm hover:bg-[#E0D0F5]"
            title="Create a new event/station to generate a new QR Code for users to scan"
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
          <div key={event.id} className="bg-white rounded-[2rem] shadow-sm border border-[#EBE0F8] overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-[#3B2D4A] line-clamp-1">{event.title}</h3>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  event.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                  event.status === 'ended' ? 'bg-[#F9F8FF] text-[#827893] ring-gray-500/10' :
                  'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                }`}>
                  {event.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-4 flex items-center text-sm text-[#827893]">
                <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-[#827893]" />
                {new Date(event.event_date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
              <div className="mt-2 flex items-center text-sm text-[#827893]">
                <Users className="mr-1.5 h-4 w-4 flex-shrink-0 text-[#827893]" />
                {event.attendances[0]?.count || 0} attendees
              </div>
            </div>
            <div className="bg-[#F9F8FF] px-6 py-4 flex gap-4 border-t border-[#EBE0F8]">
              <Link href={`/admin/events/${event.id}`} className="text-sm font-medium text-[#9D63D0] hover:text-[#9D63D0]">
                View Details
              </Link>
              <Link href={`/admin/events/${event.id}?qr=true`} className="text-sm font-medium text-[#827893] hover:text-[#3B2D4A] flex items-center">
                <QrCode className="mr-1 h-4 w-4" />
                QR
              </Link>
            </div>
          </div>
        ))}

        {(!events || events.length === 0) && (
          <div className="col-span-full py-12 text-center text-[#827893] bg-white rounded-[2rem] border border-dashed border-[#EBE0F8]">
            No events found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  )
}
