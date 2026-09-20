import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>
}) {
  const { error, message, next } = await searchParams
  const nextUrl = next || '/dashboard'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-8 shadow-sm border border-[#EBE0F8]">
        <div className="text-center">
          <div className="text-[10px] font-bold text-[#9D63D0] tracking-widest mb-1 uppercase">AURA QUEST</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#3B2D4A]">Sign in</h2>
          <p className="mt-2 text-sm text-[#827893]">
            Or{' '}
            <Link href={`/register?next=${encodeURIComponent(nextUrl)}`} className="font-medium text-[#9D63D0] hover:text-[#8B52BD]">
              create a new account
            </Link>
          </p>
        </div>

        <form action={login} className="mt-8 space-y-6">
          <input type="hidden" name="next" value={nextUrl} />
          
          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700 border border-green-200">
              {message}
            </div>
          )}

          <div className="space-y-4 rounded-2xl shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-2xl border-0 py-1.5 text-[#3B2D4A] ring-1 ring-inset ring-[#EBE0F8] placeholder:text-[#827893] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6 px-3"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-2xl border-0 py-1.5 text-[#3B2D4A] ring-1 ring-inset ring-[#EBE0F8] placeholder:text-[#827893] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6 px-3"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href={`/forgot-password?next=${encodeURIComponent(nextUrl)}`} className="font-medium text-[#9D63D0] hover:text-[#9D63D0]">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <SubmitButton>
              Sign in
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
