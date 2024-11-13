import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { updateUserProfile, getUserProfile } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profile = await getUserProfile(session.user.id)
  return NextResponse.json(profile)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profileData = await req.json()
  const updatedProfile = await updateUserProfile(session.user.id, profileData)
  
  if (!updatedProfile) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 400 })
  }

  return NextResponse.json(updatedProfile)
}