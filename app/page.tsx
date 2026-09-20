import Link from 'next/link'
import { QrCode, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-[#F9F8FF] min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="sr-only">Aura Quest</span>
              <QrCode className="h-8 w-8 text-[#9D63D0]" />
              <span className="font-bold text-xl tracking-tight text-[#3B2D4A]">✨ AURA QUEST</span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end items-center gap-6">
            <Link href="/login" className="text-sm font-semibold leading-6 text-[#3B2D4A] hover:text-[#9D63D0] transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold leading-6 text-[#9D63D0] bg-[#EBE0F8] hover:bg-[#E0D0F5] rounded-lg px-4 py-2 transition-colors">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#3B2D4A] sm:text-6xl">
              Welcome to Aura Quest!
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#827893]">
              Feel · Flow · Flourish. Immerse yourself in the AURA QUEST experience. Scan QR codes at each station, collect Aura XP, and flourish your journey.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-2xl bg-[#EBE0F8] px-3.5 py-2.5 text-sm font-semibold text-[#9D63D0] shadow-sm hover:bg-[#E0D0F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Create your account
              </Link>
              <Link href="/login" className="text-sm font-semibold leading-6 text-[#3B2D4A] hover:text-[#9D63D0] transition-colors">
                Log in to dashboard <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>

      {/* Feature section */}
      <div className="py-24 sm:py-32 bg-[#F9F8FF]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#9D63D0]">Deploy faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#3B2D4A] sm:text-4xl">
              Everything you need to run your event
            </p>
            <p className="mt-6 text-lg leading-8 text-[#827893]">
              Say goodbye to messy clipboards and manual data entry. Our platform handles the heavy lifting so you can focus on your attendees.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-[#3B2D4A]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EBE0F8]">
                    <Zap className="h-6 w-6 text-[#9D63D0]" aria-hidden="true" />
                  </div>
                  Instant Check-ins
                </dt>
                <dd className="mt-2 text-base leading-7 text-[#827893]">
                  Participants just point their camera. No apps to download. Immediate check-in straight from their browser.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-[#3B2D4A]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EBE0F8]">
                    <ShieldCheck className="h-6 w-6 text-[#9D63D0]" aria-hidden="true" />
                  </div>
                  Duplicate Protection
                </dt>
                <dd className="mt-2 text-base leading-7 text-[#827893]">
                  Strict database constraints ensure that a student can only be checked in exactly once per event.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-[#3B2D4A]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EBE0F8]">
                    <CheckCircle2 className="h-6 w-6 text-[#9D63D0]" aria-hidden="true" />
                  </div>
                  Track Participation
                </dt>
                <dd className="mt-2 text-base leading-7 text-[#827893]">
                  Watch your event participation numbers climb in real time with our powerful admin suite. Monitor student engagement easily.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
