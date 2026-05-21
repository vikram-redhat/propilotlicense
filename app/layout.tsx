import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProPilotLicense — DGCA CPL Exam Prep',
  description: 'Practice questions and mock exams for DGCA CPL pilot theory tests',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  )
}
