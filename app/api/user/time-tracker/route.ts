import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/mongodb'
import { updateUserTotalTime } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { timeSpent } = await req.json()
    
    const stats = await updateUserTotalTime(session.user.email, timeSpent)
    
    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Time tracker error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update time' },
      { status: 500 }
    )
  }
} 