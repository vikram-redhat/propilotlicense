import { use } from 'react'
import LoginForm from '@/components/LoginForm'

export default function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = use(searchParams)
  const next = params.next?.startsWith('/') ? params.next : ''
  return <LoginForm next={next} />
}
