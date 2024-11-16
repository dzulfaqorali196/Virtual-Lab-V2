import { UserProfile, ProfileUpdateData, UserPreferences } from '@/types/user'
import User from '@/models/User'
import { ObjectId } from 'mongodb'
import Experiment from '@/models/Experiment'
import mongoose from 'mongoose'

// Constants for retry logic
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000

// Utilities
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Type untuk memastikan update data structure yang benar
interface UpdateData {
  [key: string]: any;
  'profile.bio'?: string;
  'profile.institution'?: string;
  'profile.role'?: string;
  'profile.expertise'?: string[];
  'profile.social.twitter'?: string;
  'profile.social.linkedin'?: string;
  'profile.social.github'?: string;
}

interface UserWithProfile {
  profile?: UserProfile;
}

// Transaction wrapper utility
async function withTransaction<T>(
  operation: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const result = await operation(session)
    await session.commitTransaction()
    return result
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

// Retry wrapper utility
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && error instanceof Error) {
      if (
        error.name === 'MongoNetworkError' ||
        error.name === 'MongoTimeoutError' ||
        (error as any).code === 11000
      ) {
        await wait(delay)
        return withRetry(operation, retries - 1, delay * 2)
      }
    }
    throw error
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await User.findOne({ email: userId })
                          .select('profile')
                          .lean() as { profile: UserProfile } | null
    if (!user) {
      throw new Error('User not found')
    }

    return user.profile
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

interface UserStats {
  experimentsCompleted: number;
  totalTimeSpent: number;
  avgDuration: number;
  avgAngle: number;
  lastActive: Date;
}

export async function updateUserTotalTime(userId: string, additionalTime: number) {
  let retries = 3;
  
  while (retries > 0) {
    try {
      const user = await User.findOneAndUpdate(
        { email: userId },
        { 
          $inc: { 'profile.stats.totalTimeSpent': additionalTime },
          $set: { 'profile.stats.lastActive': new Date() }
        },
        { 
          new: true,
          lean: true 
        }
      ) as UserWithProfile | null;  // Tambahkan type assertion

      if (!user) {
        throw new Error('User not found')
      }

      // Return default stats jika tidak ada
      return user.profile?.stats || {
        experimentsCompleted: 0,
        totalTimeSpent: additionalTime,
        avgDuration: 0,
        avgAngle: 0,
        lastActive: new Date()
      };
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Error updating total time:', error)
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export async function updateUserProfile(userId: string, data: ProfileUpdateData) {
  try {
    const updateData: UpdateData = {
      'profile.bio': data.bio,
      'profile.institution': data.institution,
      'profile.role': data.role,
      'profile.expertise': data.expertise,
    }

    if (data.social) {
      if (data.social.twitter) updateData['profile.social.twitter'] = data.social.twitter
      if (data.social.linkedin) updateData['profile.social.linkedin'] = data.social.linkedin
      if (data.social.github) updateData['profile.social.github'] = data.social.github
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const user = await User.findOneAndUpdate(
      { email: userId },
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        select: 'profile' 
      }
    ).lean() as { profile: UserProfile } | null
    
    if (!user) {
      throw new Error('User not found')
    }

    return user.profile
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

export async function saveExperiment(userId: string, data: any) {
  try {
    const experiment = new Experiment({
      ...data,
      userId,
      timestamp: new Date(),
    })
    
    await experiment.save()
    return experiment
  } catch (error) {
    console.error('Error saving experiment:', error)
    throw error
  }
}

export async function getUserExperiments(userId: string) {
  try {
    const experiments = await Experiment.find({ userId })
      .sort({ timestamp: -1 })
      .lean()
      .exec()
    
    return experiments
  } catch (error) {
    console.error('Error fetching user experiments:', error)
    throw error
  }
}

export async function getExperimentStats(userId: string): Promise<UserStats> {
  try {
    const stats = await Experiment.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          experimentsCompleted: { $sum: 1 },
          totalTimeSpent: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' },
          avgAngle: { $avg: '$parameters.angle' }
        }
      }
    ]);

    // Default stats jika belum ada experiment
    const defaultStats: UserStats = {
      experimentsCompleted: 0,
      totalTimeSpent: 0,
      avgDuration: 0,
      avgAngle: 0,
      lastActive: new Date()
    };

    return stats[0] ? {
      experimentsCompleted: stats[0].experimentsCompleted,
      totalTimeSpent: stats[0].totalTimeSpent,
      avgDuration: stats[0].avgDuration,
      avgAngle: stats[0].avgAngle,
      lastActive: new Date()
    } : defaultStats;
  } catch (error) {
    console.error('Error getting experiment stats:', error);
    throw error;
  }
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
  return withRetry(async () => {
    try {
      const user = await User.findOneAndUpdate(
        { email: userId },
        { $set: { 'profile.preferences': preferences } },
        { 
          new: true,
          select: 'profile.preferences',
          lean: true 
        }
      ) as UserWithProfile | null
      
      if (!user) {
        throw new Error('User not found')
      }

      // Return default preferences jika tidak ada
      return user.profile?.preferences || {
        theme: "system",
        defaultLength: 1.0,
        defaultMass: 0.5,
        defaultAngle: 45,
        view3D: false,
        notifications: {
          email: true,
          push: true
        }
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  })
}

export async function saveExperimentAndUpdateStats(experimentData: any) {
  return withTransaction(async (session) => {
    // Simpan experiment
    const experiment = new Experiment(experimentData);
    await experiment.save({ session });

    // Dapatkan stats terbaru
    const stats = await getExperimentStats(experimentData.userId);

    // Update user stats
    await User.findOneAndUpdate(
      { email: experimentData.userId },
      { 
        $set: { 
          'profile.stats': stats
        }
      },
      { session }
    );

    return experiment;
  });
}

// Connection health monitoring
let isHealthy = true
mongoose.connection.on('disconnected', () => {
  isHealthy = false
})
mongoose.connection.on('connected', () => {
  isHealthy = true
})

export function isDatabaseHealthy(): boolean {
  return isHealthy && mongoose.connection.readyState === 1
}

export async function updateUserStatus(userId: string, status: 'active' | 'inactive') {
  return withRetry(async () => {
    try {
      const user = await User.findOneAndUpdate(
        { email: userId },
        { $set: { status } },
        { new: true }
      )
      
      if (!user) {
        throw new Error('User not found')
      }

      return user
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  })
}