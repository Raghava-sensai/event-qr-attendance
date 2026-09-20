'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitReview(formData: FormData) {
  const content = formData.get('content') as string
  
  if (!content) {
    return { error: 'Review content is required' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Insert review
  const { error } = await supabase
    .from('reviews')
    .insert({
      content,
      user_id: user.id
    })

  if (error) {
    console.error('Failed to submit review:', error)
    return { error: 'Failed to submit review. Please try again.' }
  }

  // Get admin email setting
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('review_email')
    .eq('id', 1)
    .single()

  const adminEmail = settings?.review_email || 'admin@example.com'

  // NOTE: In a production environment, you would use a service like Resend, SendGrid, or Nodemailer here
  // to actually send the email to `adminEmail`. For this demo, we simulate it by logging to the server console.
  console.log(`[EMAIL SIMULATION] Sending review to ${adminEmail}: "${content}" (from user ${user.id})`)

  redirect('/dashboard?review=success')
}

export async function updateAdminSettings(formData: FormData) {
  const email = formData.get('email') as string
  
  if (!email) {
    return { error: 'Email is required' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('admin_settings')
    .update({ review_email: email })
    .eq('id', 1)

  if (error) {
    console.error('Failed to update settings:', error)
    return { error: 'Failed to update settings' }
  }

  revalidatePath('/admin/settings')
  redirect('/admin/settings?success=true')
}
