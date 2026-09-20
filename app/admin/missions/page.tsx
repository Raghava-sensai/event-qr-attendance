import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Target, Trophy, Edit, Trash2 } from 'lucide-react'
import { deleteMission } from '@/app/actions/missions'

export default async function AdminMissions() {
  const supabase = await createClient()

  const { data: missions, error } = await supabase
    .from('missions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="text-[10px] font-bold text-[#D49A89] tracking-widest mb-1 uppercase">SAGA × AURELIA</div>
          <h1 className="text-2xl font-extrabold leading-6 text-[#7A6A64]">Missions & Badges</h1>
          <p className="mt-2 text-sm text-[#A39189]">
            Define gamification milestones for your students based on event categories.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/missions/new"
            className="block rounded-2xl bg-[#FFE5D9] px-4 py-2 text-center text-sm font-bold text-[#D49A89] shadow-sm hover:bg-[#FFD1C1]"
          >
            <span className="flex items-center">
              <Plus className="mr-1 h-4 w-4" />
              Create Mission
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {missions?.map((mission) => (
          <div key={mission.id} className="bg-white rounded-[2rem] shadow-sm border border-[#F2E8DF] overflow-hidden flex flex-col group">
            <div className="p-6 flex-1 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl bg-[#FFFDF9] p-3 rounded-full border border-[#F2E8DF]">{mission.badge_icon}</div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  {mission.target_category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#7A6A64] mb-1">{mission.name}</h3>
              <p className="text-sm text-[#A39189] mb-4 h-10 line-clamp-2">{mission.description}</p>
              
              <div className="bg-[#FFFDF9] rounded-lg p-3 border border-[#F2E8DF] flex items-center justify-between">
                <div className="flex items-center text-sm text-[#7A6A64] font-medium">
                  <Target className="mr-2 h-4 w-4 text-blue-500" />
                  Requires
                </div>
                <div className="text-sm font-bold text-[#7A6A64]">{mission.required_count} Events</div>
              </div>
            </div>
            <div className="bg-[#FFFDF9] px-6 py-4 border-t border-[#F2E8DF] flex items-center justify-between">
              <div className="text-sm text-[#A39189] flex items-center font-medium">
                <Trophy className="mr-1.5 h-4 w-4 text-yellow-500" />
                {mission.badge_name}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link 
                  href={`/admin/missions/${mission.id}/edit`}
                  className="p-1.5 text-[#A39189] hover:text-[#D49A89] hover:bg-blue-50 rounded-2xl transition-colors"
                  title="Edit Mission"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <form action={deleteMission}>
                  <input type="hidden" name="id" value={mission.id} />
                  <button 
                    type="submit"
                    className="p-1.5 text-[#A39189] hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                    title="Delete Mission"
                    onClick={(e) => {
                      if(!confirm('Are you sure you want to delete this mission?')) e.preventDefault();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {(!missions || missions.length === 0) && (
          <div className="col-span-full py-12 text-center text-[#A39189] bg-white rounded-[2rem] border border-dashed border-[#F2E8DF]">
            No missions created yet. Gamify your club by adding one!
          </div>
        )}
      </div>
    </div>
  )
}
