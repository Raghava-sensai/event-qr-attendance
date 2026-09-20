'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deleteMission(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  // Must verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error("Unauthorized")

  const { error } = await supabase.from('missions').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting mission:', error)
  }

  revalidatePath('/admin/missions')
  redirect('/admin/missions')
}

export async function updateMission(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const target_category = formData.get('target_category') as string
  const required_count = parseInt(formData.get('required_count') as string, 10)
  const badge_name = formData.get('badge_name') as string
  const badge_icon = formData.get('badge_icon') as string

  // Must verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error("Unauthorized")

  const { error } = await supabase.from('missions').update({
    name,
    description,
    target_category: target_category || 'All',
    required_count,
    badge_name,
    badge_icon: badge_icon || '🏆'
  }).eq('id', id)

  if (error) {
    console.error('Error updating mission:', error)
    redirect(`/admin/missions/${id}/edit?error=1`)
  }

  revalidatePath('/admin/missions')
  redirect('/admin/missions')
}
