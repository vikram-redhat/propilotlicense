import Link from 'next/link'
import { createAuthClient } from '@/lib/supabase-server'
import { hubForExamType } from '@/lib/hub'

export default async function SuccessPage() {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  const hub = hubForExamType(user?.user_metadata?.exam_type as string | undefined)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-5">✈️</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">You&apos;re all set!</h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Full access is now active on your account.
          Time to get studying.
        </p>
        <Link
          href={hub}
          className="inline-block rounded-xl px-8 py-3 font-semibold text-white text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--clr-primary)' }}
        >
          Start practising →
        </Link>
        <div className="mt-4">
          <Link href="/profile" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            View your account →
          </Link>
        </div>
      </div>
    </div>
  )
}
