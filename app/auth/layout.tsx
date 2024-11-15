"use client"

import '@/app/globals.css'
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/simulation")
    }
  }, [session, router])

  return (
    <div className="min-h-screen bg-muted/50">
      {children}
    </div>
  )
}