'use client'
import {
  IconStethoscope, IconWind, IconRoute, IconGauge,
  IconEngine, IconBuilding, IconAntenna, IconGavel,
  IconBook
} from '@tabler/icons-react'

const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  stethoscope: IconStethoscope,
  wind: IconWind,
  route: IconRoute,
  gauge: IconGauge,
  engine: IconEngine,
  building: IconBuilding,
  antenna: IconAntenna,
  gavel: IconGavel,
}

export default function SubjectIcon({ name, size = 24, className }: { name: string | null; size?: number; className?: string }) {
  const Icon = (name && icons[name]) ? icons[name] : IconBook
  return <Icon size={size} className={className} />
}
