import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { saveExperiment, getUserExperiments } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const experiments = await getUserExperiments(session.user.id)
  return NextResponse.json(experiments)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const experimentData = await req.json()
  const newExperiment = saveExperiment(session.user.id, experimentData)
  
  if (!newExperiment) {
    return NextResponse.json({ error: "Failed to save experiment" }, { status: 400 })
  }

  return NextResponse.json(newExperiment)
}