import { createEvent } from '@/app/actions/events'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center">
        <Link href="/admin" className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold leading-6 text-gray-900">Create Event</h2>
          <p className="mt-1 text-sm text-gray-500">Fill out the details below to generate a new attendance QR code.</p>
        </div>

        <div className="px-6 py-6">
          <form action={createEvent} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Event Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="e.g. AI Workshop"
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
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Introduction to AI concepts..."
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
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Initial Status</label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-x-3 border-t border-gray-100">
              <Link href="/admin" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
