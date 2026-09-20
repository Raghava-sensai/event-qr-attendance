import { resetPassword } from '@/app/actions/auth'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F8FF] p-4">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#3B2D4A]">Reset Password</h2>
          <p className="mt-2 text-sm text-[#827893]">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form action={resetPassword} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          {message && (
            <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          <div className="space-y-4 rounded-2xl shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-[#3B2D4A] mb-2">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-2xl border-0 py-1.5 text-[#3B2D4A] ring-1 ring-inset ring-[#EBE0F8] placeholder:text-[#827893] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6 px-3"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-2xl bg-[#EBE0F8] px-3 py-2 text-sm font-semibold text-[#9D63D0] hover:bg-[#E0D0F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Send Reset Link
            </button>
          </div>
          
          <div className="text-center mt-4 text-sm">
            <Link href="/login" className="font-medium text-[#9D63D0] hover:text-[#9D63D0]">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
