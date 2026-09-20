import { createClient } from '@/lib/supabase/server'
import { createMission } from '@/app/actions/missions'
import Link from 'next/link'

export default async function NewMissionPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  // Get unique categories currently used in events to populate suggestions
  const { data: categoriesData } = await supabase
    .from('events')
    .select('category')
  
  const uniqueCategories = Array.from(new Set(categoriesData?.map(c => c.category) || [])).filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin/missions" className="text-sm font-medium text-[#9D63D0] hover:text-[#9D63D0]">
          ← Back to Missions
        </Link>
      </div>

      <div className="bg-white shadow-sm sm:rounded-[2rem] border border-[#EBE0F8]">
        <div className="px-4 py-6 sm:p-8">
          <h1 className="text-xl font-semibold leading-7 text-[#3B2D4A]">Create New Mission</h1>
          <p className="mt-1 text-sm leading-6 text-[#827893]">
            Define a challenge for students to complete by attending events.
          </p>

          {searchParams.error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              <strong>Error:</strong> {searchParams.error}
            </div>
          )}

          <form action={createMission} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-[#3B2D4A]">
                  Mission Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="e.g. Photography Master"
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] placeholder:text-[#827893] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-[#3B2D4A]">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] placeholder:text-[#827893] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                    placeholder="Attend 3 photography events to unlock this badge."
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="target_category" className="block text-sm font-medium leading-6 text-[#3B2D4A]">
                  Target Category
                </label>
                <div className="mt-2">
                  <select
                    id="target_category"
                    name="target_category"
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                  >
                    <option value="All">All Categories (Global)</option>
                    <option value="General">General</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Photography">Photography</option>
                    <option value="Technical">Technical</option>
                    <option value="Social">Social</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="required_count" className="block text-sm font-medium leading-6 text-[#3B2D4A]">
                  Required Events
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="required_count"
                    id="required_count"
                    min="1"
                    defaultValue="3"
                    required
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="badge_name" className="block text-sm font-medium leading-6 text-[#3B2D4A]">
                  Reward Badge Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="badge_name"
                    id="badge_name"
                    required
                    placeholder="e.g. Shutterbug"
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="badge_icon" className="block text-sm font-medium leading-6 text-[#3B2D4A]">
                  Emoji Icon
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="badge_icon"
                    id="badge_icon"
                    maxLength={2}
                    defaultValue="🏆"
                    required
                    className="block w-full text-center text-xl rounded-2xl border-0 py-1.5 text-[#3B2D4A] shadow-sm ring-1 ring-inset ring-[#EBE0F8] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Link href="/admin/missions" className="text-sm font-semibold leading-6 text-[#3B2D4A]">
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-2xl bg-[#EBE0F8] px-3 py-2 text-sm font-semibold text-[#9D63D0] shadow-sm hover:bg-[#E0D0F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create Mission
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
