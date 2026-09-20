import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { LogOut, User, LayoutDashboard, Shield } from 'lucide-react'

export function Navbar({ isAdmin }: { isAdmin: boolean }) {
  return (
    <nav className="bg-[#FFFDF9] border-b border-[#F2E8DF] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-extrabold text-[#D49A89] tracking-wider uppercase flex items-center gap-2">
                <span className="text-2xl">✨</span> SAGA × AURELIA
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="border-transparent text-[#A39189] hover:text-[#D49A89] inline-flex items-center px-1 pt-1 border-b-2 hover:border-[#D49A89] text-sm font-bold transition-colors"
              >
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="border-transparent text-[#A39189] hover:text-[#D49A89] inline-flex items-center px-1 pt-1 border-b-2 hover:border-[#D49A89] text-sm font-bold transition-colors"
                >
                  <Shield className="mr-1.5 h-4 w-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-x-1.5 rounded-full bg-[#FFE5D9] px-4 py-2 text-sm font-bold text-[#D49A89] shadow-sm hover:bg-[#FFD1C1] transition-colors"
              >
                <LogOut className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
