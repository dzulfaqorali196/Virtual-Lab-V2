'use client';

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

import { swaggerSpec } from "./swagger"

export default function ApiDocs() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin?callbackUrl=/api-docs')
    },
  })

  if (status === "loading") {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading documentation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h1>API Documentation</h1>
        <p>
          Dokumentasi lengkap API Virtual Physics Lab. Gunakan dokumentasi ini
          sebagai referensi untuk mengintegrasikan dengan aplikasi Anda.
        </p>
        <div className="text-sm text-muted-foreground">
          Logged in as: {session.user?.email}
        </div>
      </div>
      
      <div className="swagger-wrapper dark:bg-background dark:text-foreground">
        <SwaggerUI 
          spec={swaggerSpec}
          docExpansion="list"
          defaultModelsExpandDepth={3}
          persistAuthorization={true}
        />
      </div>
    </div>
  )
}