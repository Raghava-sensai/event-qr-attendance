import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateMission } from '@/app/actions/missions'

export default async function EditMissionPage({
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

  // Fetch the mission to edit
  const { data: mission } = await supabase
    .from('missions')
    .select('*')
    .eq('id', id)
    .single()

  if (!mission) {
    redirect('/admin/missions')
  }

  // Get unique categories currently used in events to populate suggestions
  const { data: categoriesData } = await supabase
    .from('events')
    .select('category')
  
  const uniqueCategories = Array.from(new Set(categoriesData?.map(c => c.category) || [])).filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin/missions" className="text-sm font-medium text-[#D49A89] hover:text-[#D49A89]">
          ← Back to Missions
        </Link>
      </div>

      <div className="bg-white shadow-sm sm:rounded-[2rem] border border-[#F2E8DF]">
        <div className="px-4 py-6 sm:p-8">
          <h1 className="text-xl font-semibold leading-7 text-[#7A6A64]">Edit Mission</h1>
          <p className="mt-1 text-sm leading-6 text-[#A39189]">
            Update the challenge rules for this mission.
          </p>

          <form action={updateMission} className="mt-8 space-y-6">
            <input type="hidden" name="id" value={mission.id} />
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-[#7A6A64]">
                  Mission Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    defaultValue={mission.name}
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] shadow-sm ring-1 ring-inset ring-[#F2E8DF] placeholder:text-[#A39189] focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-[#7A6A64]">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    defaultValue={mission.description}
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] shadow-sm ring-1 ring-inset ring-[#F2E8DF] placeholder:text-[#A39189] focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="target_category" className="block text-sm font-medium leading-6 text-[#7A6A64]">
                  Target Category
                </label>
                <div className="mt-2">
                  <select
                    id="target_category"
                    name="target_category"
                    defaultValue={mission.target_category}
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] shadow-sm ring-1 ring-inset ring-[#F2E8DF] focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6"
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
                <label htmlFor="required_count" className="block text-sm font-medium leading-6 text-[#7A6A64]">
                  Required Events
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="required_count"
                    id="required_count"
                    min="1"
                    defaultValue={mission.required_count}
                    required
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] shadow-sm ring-1 ring-inset ring-[#F2E8DF] focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="badge_name" className="block text-sm font-medium leading-6 text-[#7A6A64]">
                  Reward Badge Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="badge_name"
                    id="badge_name"
                    required
                    defaultValue={mission.badge_name}
                    className="block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] shadow-sm ring-1 ring-inset ring-[#F2E8DF] focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="badge_icon" className="block text-sm font-medium leading-6 text-[#7A6A64]">
                  Emoji Icon
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="badge_icon"
                    id="badge_icon"
                    maxLength={2}
                    defaultValue={mission.badge_icon}
                    required
                    className="block w-full text-center text-xl rounded-2xl border-0 py-1.5 text-[#7A6A64] shadow-sm ring-1 ring-inset ring-[#F2E8DF] focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Link href="/admin/missions" className="text-sm font-semibold leading-6 text-[#7A6A64]">
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-2xl bg-[#FFE5D9] px-3 py-2 text-sm font-semibold text-[#D49A89] shadow-sm hover:bg-[#FFD1C1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
