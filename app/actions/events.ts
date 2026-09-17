'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  // Get current user to attach as created_by
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string
  const status = formData.get('status') as string || 'upcoming'

  // Combine date and time into a single timestamp
  const eventDate = new Date(`${dateStr}T${timeStr}:00`).toISOString()

  const { data, error } = await supabase
    .from('events')
    .insert({
      title,
      description,
      event_date: eventDate,
      created_by: user.id,
      status
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating event:', error)
    redirect(`/admin/events/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin')
  redirect(`/admin/events/${data.id}`)
}
