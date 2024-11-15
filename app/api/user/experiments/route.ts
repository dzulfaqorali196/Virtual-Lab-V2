import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/mongodb'
import Experiment from '@/models/Experiment'

// Get user's experiment statistics
export async function GET(req: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await Experiment.aggregate([
      { $match: { userId: session.user.email } },
      {
        $group: {
          _id: null,
          totalExperiments: { $sum: 1 },
          completedExperiments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalDuration: { $sum: '$duration' },
          averageDuration: { $avg: '$duration' },
          // Get activity stats
          totalActivities: { $sum: { $size: '$activityLog' } },
          // Get latest activity
          lastActivity: { $max: '$lastModified' }
        }
      }
    ])

    // Get recent activity
    const recentActivity = await Experiment.find({ 
      userId: session.user.email,
      lastModified: { $exists: true }
    })
    .sort({ lastModified: -1 })
    .limit(5)
    .select('title status activityLog')
    .lean()

    return NextResponse.json({
      stats: stats[0] || {
        totalExperiments: 0,
        completedExperiments: 0,
        totalDuration: 0,
        averageDuration: 0,
        totalActivities: 0,
        lastActivity: null
      },
      recentActivity
    })
  } catch (error) {
    console.error('Fetch user experiments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user experiments data' },
      { status: 500 }
    )
  }
}