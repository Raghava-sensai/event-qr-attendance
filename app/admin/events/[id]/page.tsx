import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft, Calendar, Download } from 'lucide-react'
import { QRCodeDisplay } from '@/components/QRCodeDisplay'
import DownloadQRButton from '@/components/DownloadQRButton'
import { notFound } from 'next/navigation'

export default async function EventDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ qr?: string }>
}) {
  const { id } = await params
  const { qr } = await searchParams
  const supabase = await createClient()
  const showQr = qr === 'true'

  // Get event details
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    return notFound()
  }

  // Get attendees
  const { data: attendances, error: attendancesError } = await supabase
    .from('attendances')
    .select(`
      id,
      scanned_at,
      profiles:user_id (username)
    `)
    .eq('event_id', id)
    .order('scanned_at', { ascending: false })

  const eventUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/event/${event.qr_token}`

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center">
        <Link href="/admin" className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Events
        </Link>
      </div>

      {showQr ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-center py-12 px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h2>
          <p className="text-gray-500 mb-8">{attendances?.length || 0} Participants so far</p>
          
          <QRCodeDisplay url={eventUrl} />
          
          <div className="mt-8">
            <Link 
              href={`/admin/events/${id}`}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-3"
            >
              Hide QR
            </Link>
            <DownloadQRButton eventName={event.title} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                {event.title}
              </h2>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6 text-sm text-gray-500">
                <div className="mt-2 flex items-center sm:mt-0">
                  <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  Date: {new Date(event.event_date).toLocaleDateString()}
                </div>
                <div className="mt-2 flex items-center sm:mt-0">
                  Created: {new Date(event.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <Link 
              href={`/admin/events/${id}?qr=true`}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Show QR Code
            </Link>
          </div>

          <div className="px-6 py-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Event Participation ({attendances?.length || 0})
            </h3>
            
            <div className="mt-4 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          Username
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Time Scanned
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attendances?.map((attendance) => (
                        <tr key={attendance.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {/* @ts-expect-error Types from Supabase join need casting */}
                            {attendance.profiles?.username || 'Unknown'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(attendance.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                      
                      {(!attendances || attendances.length === 0) && (
                        <tr>
                          <td colSpan={2} className="py-8 text-center text-sm text-gray-500">
                            No one has checked in yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
