import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getLearningProgress, updateLearningProgress } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await getLearningProgress(session.user.email)
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error getting learning progress:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get learning progress' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sectionId, score } = await req.json()
    
    if (!sectionId || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const progress = await updateLearningProgress(session.user.email, sectionId, score)
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error updating learning progress:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update learning progress' },
      { status: 500 }
    )
  }
}
