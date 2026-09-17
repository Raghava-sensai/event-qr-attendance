import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewMissionPage() {
  const supabase = await createClient()

  // Get unique categories currently used in events to populate suggestions
  const { data: categoriesData } = await supabase
    .from('events')
    .select('category')
  
  const uniqueCategories = Array.from(new Set(categoriesData?.map(c => c.category) || [])).filter(Boolean)

  async function createMission(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const target_category = formData.get('target_category') as string
    const required_count = parseInt(formData.get('required_count') as string, 10)
    const badge_name = formData.get('badge_name') as string
    const badge_icon = formData.get('badge_icon') as string

    const { error } = await supabase.from('missions').insert({
      name,
      description,
      target_category: target_category || 'All',
      required_count,
      badge_name,
      badge_icon: badge_icon || '🏆',
      created_by: user.id
    })

    if (error) {
      console.error('Error creating mission:', error)
      redirect('/admin/missions/new?error=1')
    }

    redirect('/admin/missions')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin/missions" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          ← Back to Missions
        </Link>
      </div>

      <div className="bg-white shadow-sm sm:rounded-xl border border-gray-200">
        <div className="px-4 py-6 sm:p-8">
          <h1 className="text-xl font-semibold leading-7 text-gray-900">Create New Mission</h1>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Define a challenge for students to complete by attending events.
          </p>

          <form action={createMission} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Mission Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="e.g. Photography Master"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Attend 3 photography events to unlock this badge."
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="target_category" className="block text-sm font-medium leading-6 text-gray-900">
                  Target Category
                </label>
                <div className="mt-2">
                  <select
                    id="target_category"
                    name="target_category"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                <label htmlFor="required_count" className="block text-sm font-medium leading-6 text-gray-900">
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="badge_name" className="block text-sm font-medium leading-6 text-gray-900">
                  Reward Badge Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="badge_name"
                    id="badge_name"
                    required
                    placeholder="e.g. Shutterbug"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="badge_icon" className="block text-sm font-medium leading-6 text-gray-900">
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
                    className="block w-full text-center text-xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Link href="/admin/missions" className="text-sm font-semibold leading-6 text-gray-900">
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
