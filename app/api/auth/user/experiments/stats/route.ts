import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/mongodb"
import Experiment from "@/models/Experiment"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const stats = await Experiment.aggregate([
      { $match: { userId: session.user.email } },
      {
        $group: {
          _id: null,
          totalExperiments: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          avgAngle: { $avg: '$parameters.angle' },
          totalTime: { $sum: '$duration' }
        }
      }
    ])

    const defaultStats = {
      totalExperiments: 0,
      avgDuration: 0,
      avgAngle: 0,
      totalTime: 0
    }

    return NextResponse.json(stats[0] || defaultStats)
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    )
  }
} 