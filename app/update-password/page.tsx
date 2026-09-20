import { updatePassword } from '@/app/actions/auth'
import Link from 'next/link'

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9] p-4">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#7A6A64]">Set New Password</h2>
          <p className="mt-2 text-sm text-[#A39189]">
            Please enter your new password below.
          </p>
        </div>

        <form action={updatePassword} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-2xl shadow-sm">
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-[#7A6A64] mb-2">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="relative block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] ring-1 ring-inset ring-[#F2E8DF] placeholder:text-[#A39189] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6 px-3"
                placeholder="New Password (min 6 characters)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-2xl bg-[#FFE5D9] px-3 py-2 text-sm font-semibold text-[#D49A89] hover:bg-[#FFD1C1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
