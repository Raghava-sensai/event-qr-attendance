'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

export function SubmitButton({ 
  children, 
  className = "w-full rounded-2xl bg-[#FFE5D9] hover:bg-[#FFD1C1] px-3 py-3 text-sm font-bold text-[#D49A89] shadow-sm transition-colors flex justify-center items-center" 
}: { 
  children: React.ReactNode,
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {pending ? 'Processing...' : children}
    </button>
  )
}
