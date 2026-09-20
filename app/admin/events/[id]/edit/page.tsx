import { updateEvent } from '@/app/actions/events'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function EditEventPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) redirect('/admin')

  const eventDate = new Date(event.event_date)
  const dateStr = eventDate.toISOString().split('T')[0]
  const timeStr = eventDate.toISOString().split('T')[1].substring(0, 5)

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center">
        <Link href={`/admin/events/${id}`} className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Event
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold leading-6 text-gray-900">Edit Event</h2>
        </div>

        <div className="px-6 py-6">
          <form action={updateEvent} className="space-y-6">
            <input type="hidden" name="id" value={id} />
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Event Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  defaultValue={event.title}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={event.description}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">Date</label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    defaultValue={dateStr}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">Time</label>
                <div className="mt-2">
                  <input
                    type="time"
                    name="time"
                    id="time"
                    defaultValue={timeStr}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="stage_label" className="block text-sm font-medium leading-6 text-gray-900">Stage Label (Aurelia Fest)</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="stage_label"
                    id="stage_label"
                    defaultValue={event.stage_label}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="e.g. STAGE 1 · FEEL"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium leading-6 text-gray-900">Pills / Tags (Comma separated)</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    defaultValue={event.tags}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="e.g. Face Paint, Blindfolded Art"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    defaultValue={event.category}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    <option value="General">General</option>
                    <option value="Photography">Photography</option>
                    <option value="Technical">Technical</option>
                    <option value="Social">Social</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
                <div className="mt-2">
                  <select
                    id="status"
                    name="status"
                    defaultValue={event.status}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-x-3 border-t border-gray-100">
              <Link href={`/admin/events/${id}`} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
