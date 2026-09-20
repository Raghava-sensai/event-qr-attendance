'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nextUrl = formData.get('next') as string || '/dashboard'

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextUrl)}`)
  }

  // Ensure profile exists (in case they were missing from database)
  if (data.user) {
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', data.user.id).single()
    if (!profile) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username: email.split('@')[0],
        avatar: '🦊',
        role: 'user'
      })
    }
  }

  redirect(nextUrl)
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const avatar = formData.get('avatar') as string || '🦊'
  const nextUrl = formData.get('next') as string || '/dashboard'

  let { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  // If user already exists, let's just log them in seamlessly!
  if (error && error.message.includes('User already registered')) {
    const loginRes = await supabase.auth.signInWithPassword({ email, password })
    if (loginRes.error) {
      return redirect(`/register?error=${encodeURIComponent(loginRes.error.message)}&next=${encodeURIComponent(nextUrl)}`)
    }
    data = loginRes.data
    error = null
  }

  if (error) {
    return redirect(`/register?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextUrl)}`)
  }

  // Ensure profile is created or updated with new avatar
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      username,
      avatar,
      role: 'user' // default role
    })
  }

  // Wait a small moment to ensure session is fully established before redirecting
  await new Promise(resolve => setTimeout(resolve, 500))

  redirect(nextUrl)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const nextUrl = formData.get('next') as string || '/dashboard'
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    return redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  return redirect(`/forgot-password?message=${encodeURIComponent('Check your email for the password reset link.')}`)
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return redirect(`/update-password?error=${encodeURIComponent(error.message)}`)
  }

  // After updating the password, redirect to login
  redirect('/login?message=' + encodeURIComponent('Password updated successfully. Please log in.'))
}

