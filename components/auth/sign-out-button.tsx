"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      // Update status ke inactive sebelum sign out
      await fetch('/api/user/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive' })
      })
      
      // Lakukan sign out
      await signOut()
    } catch (error) {
      console.error('Error during sign out:', error)
      // Tetap lakukan sign out meskipun update status gagal
      await signOut()
    }
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  )
} 