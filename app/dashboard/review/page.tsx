import { submitReview } from '@/app/actions/reviews'
import { SubmitButton } from '@/components/SubmitButton'
import Link from 'next/link'
import { ArrowLeft, MessageSquareHeart } from 'lucide-react'

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#7A6A64] pb-32 font-sans relative">
      <div className="max-w-md mx-auto px-6 py-8">
        
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-[#A39189] hover:text-[#D49A89] mb-6 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#F2E8DF]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#FFE5D9] flex items-center justify-center">
              <MessageSquareHeart className="w-8 h-8 text-[#D49A89]" />
            </div>
          </div>
          
          <h1 className="text-2xl font-extrabold text-center text-[#7A6A64] mb-2">Leave a Review</h1>
          <p className="text-center text-[#A39189] text-sm mb-8">
            Tell us about your experience at Aurelia Fest! Your feedback will be sent directly to the organizers.
          </p>

          <form action={submitReview} className="space-y-6">
            <div>
              <label htmlFor="content" className="block text-sm font-bold text-[#7A6A64] mb-2">
                Your Thoughts
              </label>
              <textarea
                id="content"
                name="content"
                rows={5}
                required
                placeholder="I loved the Whisker Wall because..."
                className="block w-full rounded-2xl border-0 py-3 px-4 text-[#7A6A64] shadow-sm ring-1 ring-inset ring-[#F2E8DF] placeholder:text-[#A39189] focus:ring-2 focus:ring-inset focus:ring-[#FFD1C1] sm:text-sm sm:leading-6"
              ></textarea>
            </div>

            <SubmitButton>
              Send Review
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  )
}
