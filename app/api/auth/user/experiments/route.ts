import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { saveExperiment, getUserExperiments } from "@/lib/db"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const experiments = await getUserExperiments(session.user.email)
    return NextResponse.json(experiments)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch experiments" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const experimentData = await req.json()
    delete experimentData.status
    
    const savedExperiment = await saveExperiment(session.user.email, experimentData)
    
    if (!savedExperiment) {
      return NextResponse.json(
        { error: "Failed to save experiment" },
        { status: 400 }
      )
    }

    return NextResponse.json(savedExperiment)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save experiment" },
      { status: 500 }
    )
  }
}