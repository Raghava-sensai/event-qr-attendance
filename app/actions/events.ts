'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string
  const status = formData.get('status') as string || 'upcoming'
  const category = formData.get('category') as string || 'General'
  const stage_label = formData.get('stage_label') as string
  const xp_value = parseInt(formData.get('xp_value') as string) || 1 || ''
  const tags = formData.get('tags') as string || ''

  const eventDate = new Date(`${dateStr}T${timeStr}:00`).toISOString()

  const { data, error } = await supabase.from('events').insert({
    title,
    description,
    event_date: eventDate,
    created_by: user.id,
    status,
    category,
    stage_label,
    tags
  }).select('id').single()

  if (error) {
    console.error('Error creating event:', error)
    redirect(`/admin/events/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin')
  redirect(`/admin/events/${data.id}`)
}

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string
  const status = formData.get('status') as string || 'upcoming'
  const category = formData.get('category') as string || 'General'
  const stage_label = formData.get('stage_label') as string
  const xp_value = parseInt(formData.get('xp_value') as string) || 1 || ''
  const tags = formData.get('tags') as string || ''

  const eventDate = new Date(`${dateStr}T${timeStr}:00`).toISOString()

  const { error } = await supabase.from('events').update({
    title,
    description,
    event_date: eventDate,
    status,
    category,
    stage_label,
    tags
  }).eq('id', id)

  if (error) {
    console.error('Error updating event:', error)
    redirect(`/admin/events/${id}/edit?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin')
  redirect(`/admin/events/${id}`)
}

export async function deleteEvent(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) console.error('Error deleting event:', error)

  revalidatePath('/admin')
  redirect('/admin')
}
