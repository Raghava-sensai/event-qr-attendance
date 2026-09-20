import { createClient } from '@/lib/supabase/server'
import { updateAdminSettings } from '@/app/actions/reviews'
import { SubmitButton } from '@/components/SubmitButton'
import { Mail, Settings } from 'lucide-react'

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  // Ensure admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return <div className="p-8 text-center text-red-500">Access Denied</div>
  }

  // Fetch settings
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const currentEmail = settings?.review_email || 'admin@example.com'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div 
        className="sm:flex sm:items-center mb-8 cursor-help"
        title="Admin Settings: Configure global application settings like where user reviews should be sent."
      >
        <div className="sm:flex-auto">
          <div className="text-[10px] font-bold text-[#9D63D0] tracking-widest mb-1 uppercase">SAGA × AURELIA</div>
          <h1 className="text-2xl font-extrabold leading-6 text-[#3B2D4A]">Global Settings</h1>
          <p className="mt-2 text-sm text-[#827893]">
            Configure where notifications and reviews are sent.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-[#EBE0F8] sm:rounded-[2rem] max-w-2xl p-8">
        <form action={updateAdminSettings} className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#EBE0F8] flex items-center justify-center">
              <Settings className="w-6 h-6 text-[#9D63D0]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3B2D4A]">Review Target Email</h2>
              <p className="text-sm text-[#827893]">The Gmail address that receives student reviews.</p>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold leading-6 text-[#3B2D4A]">
              Admin Gmail Address
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-[#827893]" aria-hidden="true" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                required
                defaultValue={currentEmail}
                className="block w-full rounded-2xl border-0 py-3 pl-10 text-[#3B2D4A] ring-1 ring-inset ring-[#EBE0F8] placeholder:text-[#827893] focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                placeholder="admin@gmail.com"
              />
            </div>
          </div>

          <SubmitButton>
            Save Settings
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}
