import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })

export const metadata: Metadata = {
  title: 'ProPilotLicence — DGCA Pilot Licence Exam Prep',
  description: 'Practice questions and mock exams for DGCA CPL and ATPL pilot licence theory tests',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      {/* Apply saved palette before first paint to avoid flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var p=localStorage.getItem('palette');if(p==='B')document.documentElement.dataset.palette='B'})()` }} />
      </head>
      <body className="min-h-screen antialiased" style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
