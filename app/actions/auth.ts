'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nextUrl = formData.get('next') as string || '/dashboard'

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextUrl)}`)
  }

  redirect(nextUrl)
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nextUrl = formData.get('next') as string || '/dashboard'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    // By default, Supabase requires email verification. For this tutorial app, we assume 
    // email confirmation is turned off in the Supabase dashboard, or they can verify.
    // If you want auto-sign in after registration, make sure email confirmation is OFF.
    options: {
      data: {
        username: username,
      },
    },
  })

  if (error) {
    return redirect(`/register?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextUrl)}`)
  }

  // After registration, sign in or redirect
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

