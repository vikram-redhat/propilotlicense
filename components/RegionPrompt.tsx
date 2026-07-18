'use client'
import { useEffect } from 'react'
import { initRegion } from '@/lib/detect-region'

// ponytail: no custom UI — triggers native browser "allow location?" prompt
export default function RegionPrompt() {
  useEffect(() => { initRegion() }, [])
  return null
}
