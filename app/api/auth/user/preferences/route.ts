import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { updateUserPreferences } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const preferences = await updateUserPreferences(session.user.id, {})
  return NextResponse.json(preferences)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const preferences = await req.json()
  const updatedPreferences = await updateUserPreferences(session.user.id, preferences)
  
  if (!updatedPreferences) {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 400 })
  }

  return NextResponse.json(updatedPreferences)
}