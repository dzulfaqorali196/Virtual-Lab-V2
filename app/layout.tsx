'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/auth/auth-provider'
import Navbar from '@/components/navbar'
import { useTimeTracker } from '@/hooks/use-time-tracker'
import { SessionProvider } from 'next-auth/react'
import { Footer } from '@/components/footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="shortcut icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body>
        <SessionProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <TimeTrackerWrapper>
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 container mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6">
                    {children}
                  </main>
                  <Toaster />
                  <Footer />
                </div>
              </TimeTrackerWrapper>
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

// Komponen wrapper terpisah untuk useTimeTracker
function TimeTrackerWrapper({ children }: { children: React.ReactNode }) {
  useTimeTracker()
  return <>{children}</>
}