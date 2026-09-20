import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error, next } = await searchParams
  const nextUrl = next || '/dashboard'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-8 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="text-[10px] font-bold text-[#D49A89] tracking-widest mb-1 uppercase">SAGA × AURELIA</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#7A6A64]">Sign in</h2>
          <p className="mt-2 text-sm text-[#A39189]">
            Or{' '}
            <Link href={`/register?next=${encodeURIComponent(nextUrl)}`} className="font-medium text-[#D49A89] hover:text-[#B58273]">
              create a new account
            </Link>
          </p>
        </div>

        <form action={login} className="mt-8 space-y-6">
          <input type="hidden" name="next" value={nextUrl} />
          
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
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
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href={`/forgot-password?next=${encodeURIComponent(nextUrl)}`} className="font-medium text-blue-600 hover:text-blue-500">
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
