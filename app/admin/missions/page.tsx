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
      <div 
        className="sm:flex sm:items-center cursor-help"
        title="Manage Badge Rules: This page lets you set up rules for when users unlock badges. e.g. 'Get the Workshop badge after checking into 3 workshop events!'"
      >
        <div className="sm:flex-auto">
          <div className="text-[10px] font-bold text-[#9D63D0] tracking-widest mb-1 uppercase">SAGA × AURELIA</div>
          <h1 className="text-2xl font-extrabold leading-6 text-[#3B2D4A]">Manage Badge Rules</h1>
          <p className="mt-2 text-sm text-[#827893]">
            Define gamification milestones (like getting 4 Aura XP) to automatically reward students with badges upon scan.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/missions/new"
            className="block rounded-2xl bg-[#EBE0F8] px-4 py-2 text-center text-sm font-bold text-[#9D63D0] shadow-sm hover:bg-[#E0D0F5]"
            title="Create a new Badge unlocking rule"
          >
            <span className="flex items-center">
              <Plus className="mr-1 h-4 w-4" />
              Create Badge Rule
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {missions?.map((mission) => (
          <div key={mission.id} className="bg-white rounded-[2rem] shadow-sm border border-[#EBE0F8] overflow-hidden flex flex-col group">
            <div className="p-6 flex-1 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl bg-[#F9F8FF] p-3 rounded-full border border-[#EBE0F8]">{mission.badge_icon}</div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  {mission.target_category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#3B2D4A] mb-1">{mission.name}</h3>
              <p className="text-sm text-[#827893] mb-4 h-10 line-clamp-2">{mission.description}</p>
              
              <div className="bg-[#F9F8FF] rounded-lg p-3 border border-[#EBE0F8] flex items-center justify-between">
                <div className="flex items-center text-sm text-[#3B2D4A] font-medium">
                  <Target className="mr-2 h-4 w-4 text-blue-500" />
                  Requires
                </div>
                <div className="text-sm font-bold text-[#3B2D4A]">{mission.required_count} Events</div>
              </div>
            </div>
            <div className="bg-[#F9F8FF] px-6 py-4 border-t border-[#EBE0F8] flex items-center justify-between">
              <div className="text-sm text-[#827893] flex items-center font-medium">
                <Trophy className="mr-1.5 h-4 w-4 text-yellow-500" />
                {mission.badge_name}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link 
                  href={`/admin/missions/${mission.id}/edit`}
                  className="p-1.5 text-[#827893] hover:text-[#9D63D0] hover:bg-blue-50 rounded-2xl transition-colors"
                  title="Edit Mission"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <form action={deleteMission}>
                  <input type="hidden" name="id" value={mission.id} />
                  <button 
                    type="submit"
                    className="p-1.5 text-[#827893] hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
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
          <div className="col-span-full py-12 text-center text-[#827893] bg-white rounded-[2rem] border border-dashed border-[#EBE0F8]">
            No missions created yet. Gamify your club by adding one!
          </div>
        )}
      </div>
    </div>
  )
}
