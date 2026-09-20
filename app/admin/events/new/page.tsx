import { createEvent } from '@/app/actions/events'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center">
        <Link href="/admin" className="text-[#827893] hover:text-[#3B2D4A] flex items-center text-sm font-medium">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Admin
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EBE0F8] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#EBE0F8]">
          <h2 className="text-xl font-semibold leading-6 text-[#3B2D4A]">Create Event</h2>
          <p className="mt-1 text-sm text-[#827893]">Fill out the details below to generate a new attendance QR code.</p>
        </div>

        <div className="px-6 py-6">
          <form action={createEvent} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Event Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="block w-full rounded-2xl border-0 py-1.5 px-3 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] placeholder:text-[#827893] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                  placeholder="e.g. AI Workshop"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Description</label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-2xl border-0 py-1.5 px-3 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] placeholder:text-[#827893] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                  placeholder="Introduction to AI concepts..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Date</label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    className="block w-full rounded-2xl border-0 py-1.5 px-3 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Time</label>
                <div className="mt-2">
                  <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    className="block w-full rounded-2xl border-0 py-1.5 px-3 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="stage_label" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Stage Label (Aurelia Fest)</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="stage_label"
                    id="stage_label"
                    className="block w-full rounded-2xl border-0 py-1.5 px-3 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                    placeholder="e.g. STAGE 1 · FEEL"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Pills / Tags (Comma separated)</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    className="block w-full rounded-2xl border-0 py-1.5 px-3 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                    placeholder="e.g. Face Paint, Blindfolded Art"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Category</label>
                <div className="mt-2">
                  <select name="category" id="category" className="block w-full rounded-2xl border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6">
                    <option value="General">General</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Networking">Networking</option>
                    <option value="Main Event">Main Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="xp_value" className="block text-sm font-medium leading-6 text-[#3B2D4A]">XP Value</label>
                <div className="mt-2">
                  <input type="number" name="xp_value" id="xp_value" defaultValue="5" className="block w-full rounded-2xl border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label htmlFor="unlock_xp" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Required XP to Unlock</label>
                <div className="mt-2">
                  <input type="number" name="unlock_xp" id="unlock_xp" defaultValue="0" className="block w-full rounded-2xl border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-[#3B2D4A]">Initial Status</label>
                <div className="mt-2">
                  <select name="status" id="status" className="block w-full rounded-2xl border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6">
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-x-3 border-t border-[#EBE0F8]">
              <Link href="/admin" className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] hover:bg-[#F9F8FF]">
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-2xl bg-[#EBE0F8] px-3 py-2 text-sm font-semibold text-[#9D63D0] shadow-sm hover:bg-[#E0D0F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
