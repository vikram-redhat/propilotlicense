import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })

export const metadata: Metadata = {
  title: 'ProPilotLicence — DGCA Pilot Licence Exam Prep',
  description: 'Practice questions and mock exams for DGCA CPL and ATPL pilot licence theory tests',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen antialiased" style={{ background: '#F8FAFF', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
