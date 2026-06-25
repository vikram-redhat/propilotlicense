import SignupForm from '@/components/SignupForm'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const safeNext = next?.startsWith('/') ? next : '/'
  return <SignupForm next={safeNext} />
}
