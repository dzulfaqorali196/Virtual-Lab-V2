"use client"

import '@/app/globals.css'
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/simulation"

  return (
    <div className="container min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-[380px] p-6 sm:p-8">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Welcome to Virtual Physics Lab
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in to continue your learning journey
            </p>
          </div>

          <div className="grid gap-3">
            <Button
              variant="outline"
              className="h-10 sm:h-11 text-sm"
              onClick={() => signIn("google", { callbackUrl })}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              className="h-10 sm:h-11 text-sm"
              onClick={() => signIn("github", { callbackUrl })}
            >
              <Icons.github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}