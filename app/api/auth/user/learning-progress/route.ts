import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { updateLearningProgress, getLearningProgress } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const progress = await getLearningProgress(session.user.id)
    return NextResponse.json(progress || { completedSections: [], quizScores: {} })
  } catch (error) {
    console.error('Error loading progress:', error)
    return NextResponse.json(
      { error: "Failed to load progress" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const progressData = await req.json()
    const updatedProgress = await updateLearningProgress(session.user.id, progressData)
    return NextResponse.json(updatedProgress)
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )
  }
}