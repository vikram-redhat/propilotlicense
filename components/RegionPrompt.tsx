'use client'
import { useEffect } from 'react'
import { initRegion } from '@/lib/detect-region'

// ponytail: no UI — detects region from IP on first visit
export default function RegionPrompt() {
  useEffect(() => { initRegion() }, [])
  return null
}
