import { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/auth/auth-provider'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Virtual Physics Lab - Pendulum Experiment',
  description: 'Interactive virtual physics laboratory for pendulum experiments and learning'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6">
                {children}
              </main>
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}