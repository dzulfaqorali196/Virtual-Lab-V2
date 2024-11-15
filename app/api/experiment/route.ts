import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/mongodb'
import { getUserExperiments } from '@/lib/db'

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
    console.error('Error:', error)
    return NextResponse.json(
      { error: "Failed to fetch experiments" },
      { status: 500 }
    )
  }
} 