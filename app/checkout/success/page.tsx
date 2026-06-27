import Link from 'next/link'

export default function SuccessPage() {
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
          href="/cpl"
          className="inline-block rounded-xl px-8 py-3 font-semibold text-white text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: '#185FA5' }}
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
