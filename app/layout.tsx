import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { ThemeProvider } from '@/components/ThemeProvider'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'ProPilotLicence — DGCA CPL & ATPL Theory Exam Prep', template: '%s' },
  description: 'Practice questions for DGCA CPL and ATPL theory exams — sourced from prescribed textbooks, verified by active airline captains.',
  metadataBase: new URL('https://propilotlicence.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      {/* Apply saved palette before first paint to avoid flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var p=localStorage.getItem('palette');if(p==='B')document.documentElement.dataset.palette='B'})()` }} />
      </head>
      <body className="min-h-screen antialiased" style={{ fontFamily: 'system-ui,-apple-system,sans-serif' }}>
        <OrganizationSchema />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
