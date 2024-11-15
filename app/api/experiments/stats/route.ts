import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/mongodb'
import { updateUserTotalTime } from '@/lib/db'
import Experiment from '@/models/Experiment'

export async function GET(req: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const status = searchParams.get('status')

    // Build query
    const query = { 
      userId: session.user.email,
      ...(status && { status })
    }

    // Get total count for pagination
    const total = await Experiment.countDocuments(query)

    // Get paginated experiments with activity log
    const experiments = await Experiment.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({
      experiments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    })
  } catch (error) {
    console.error('Fetch experiments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiments' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    
    // Create initial activity log
    const activity = {
      action: 'started',
      timestamp: new Date(),
      parameters: data.parameters
    }

    const experiment = new Experiment({
      ...data,
      userId: session.user.email,
      timestamp: new Date(),
      activityLog: [activity],
      version: 1
    })
    
    await experiment.save()

    // Update user's total experiment time
    if (data.duration) {
      await updateUserTotalTime(session.user.email, data.duration)
    }

    return NextResponse.json(experiment)
  } catch (error) {
    console.error('Create experiment error:', error)
    return NextResponse.json(
      { error: 'Failed to create experiment' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { experimentId, action, parameters, duration } = await req.json()

    // Record activity
    const activity = {
      action,
      timestamp: new Date(),
      parameters
    }

    const experiment = await Experiment.findOneAndUpdate(
      { 
        _id: experimentId,
        userId: session.user.email 
      },
      { 
        $push: { activityLog: activity },
        $inc: { version: 1 },
        $set: {
          lastModified: new Date(),
          isDirty: action !== 'completed',
          ...(parameters && { parameters }),
          ...(duration && { duration })
        }
      },
      { new: true }
    )

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      )
    }

    // Update user stats if experiment completed
    if (action === 'completed' && duration) {
      await updateUserTotalTime(session.user.email, duration)
    }

    return NextResponse.json(experiment)
  } catch (error) {
    console.error('Update experiment error:', error)
    return NextResponse.json(
      { error: 'Failed to update experiment' },
      { status: 500 }
    )
  }
}