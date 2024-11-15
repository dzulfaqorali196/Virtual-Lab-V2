import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/mongodb"
import Experiment from "@/models/Experiment"

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

    const experiments = await Experiment.find({ userId: session.user.email })
      .sort({ timestamp: -1 })
      .lean()

    // Format CSV data
    const headers = ['Date', 'Length (m)', 'Mass (kg)', 'Angle (°)', 'Duration (s)', 'Status']
    const rows = experiments.map(exp => [
      new Date(exp.timestamp).toLocaleString(),
      exp.parameters.length,
      exp.parameters.mass,
      exp.parameters.angle,
      exp.duration,
      exp.status
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Return as CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=experiments-${new Date().toISOString()}.csv`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic' 