"use client"

import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error")

  const errorMessages: { [key: string]: string } = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred while trying to authenticate.",
  }

  const errorMessage = error ? errorMessages[error] : errorMessages.Default

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Authentication Error
            </h1>
            <p className="mt-2 text-muted-foreground">
              {errorMessage}
            </p>
          </div>
          <Link href="/auth/signin">
            <Button>
              Try Again
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}