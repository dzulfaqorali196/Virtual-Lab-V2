import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await request.json()

    await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          'profile.stats.experimentsCompleted': stats.totalExperiments,
          'profile.stats.totalExperimentTime': stats.totalTime,
          'profile.stats.avgDuration': stats.avgDuration,
          'profile.stats.avgAngle': stats.avgAngle
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    )
  }
} 