import { register } from '@/app/actions/auth'
import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'

const AVATARS = ['🦊', '🐼', '🐸', '🦄', '🦖', '👻', '🤖', '🐙']

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error, next } = await searchParams
  const nextUrl = next || '/dashboard'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-8 shadow-sm border border-[#F2E8DF]">
        <div className="text-center">
          <div className="text-[10px] font-bold text-[#D49A89] tracking-widest mb-1 uppercase">SAGA × AURELIA</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#7A6A64]">Create Account</h2>
          <p className="mt-2 text-sm text-[#A39189]">
            Or{' '}
            <Link href={`/login?next=${encodeURIComponent(nextUrl)}`} className="font-medium text-[#D49A89] hover:text-[#B58273]">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form action={register} className="mt-8 space-y-6">
          <input type="hidden" name="next" value={nextUrl} />
          
          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium leading-6 text-[#7A6A64] mb-2">Choose your Avatar</label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {AVATARS.map((avatar, idx) => (
                <label key={avatar} className="cursor-pointer relative">
                  <input type="radio" name="avatar" value={avatar} defaultChecked={idx === 0} className="peer sr-only" />
                  <div className="text-3xl sm:text-4xl p-2 text-center rounded-[2rem] border-2 border-transparent peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-[#FFFDF9] transition-all">
                    {avatar}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] ring-1 ring-inset ring-[#F2E8DF] placeholder:text-[#A39189] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6 px-3"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] ring-1 ring-inset ring-[#F2E8DF] placeholder:text-[#A39189] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6 px-3"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="relative block w-full rounded-2xl border-0 py-1.5 text-[#7A6A64] ring-1 ring-inset ring-[#F2E8DF] placeholder:text-[#A39189] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6 px-3"
                placeholder="Password (min 6 characters)"
              />
            </div>
          </div>

          <div>
            <SubmitButton>
              Create Account
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
