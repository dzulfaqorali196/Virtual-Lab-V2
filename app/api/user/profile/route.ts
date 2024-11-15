// app/api/user/profile/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { error } from 'console'

// Sesuaikan dengan schema
interface UserProfile {
  bio?: string
  institution?: string
  role?: string
  expertise?: string[]
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  achievements?: Array<{
    id: string
    name: string
    description: string
    earnedAt: Date
  }>
  stats?: {
    experimentsCompleted: number
    totalExperimentTime: number
    lastActive: Date
  }
}

interface UserDocument {
  _id: string
  name?: string
  email: string
  image?: string
  profile?: UserProfile
  userRole: 'user' | 'admin'
  status: 'active' | 'suspended'
}

// Tambahkan interface untuk validation error
interface ValidationError {
  message: string;
  errors: { [key: string]: { message: string } };
  name: string;
}

// Tambahkan type untuk update data
interface ProfileUpdateData {
  'profile.bio'?: string;
  'profile.institution'?: string;
  'profile.role'?: string;
  'profile.expertise'?: string[];
  'profile.social'?: {
    twitter: string;
    linkedin: string;
    github: string;
  };
  [key: string]: any; // Untuk memungkinkan dynamic keys
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('No session or user email')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const user = await User.findOne({ email: session.user.email })
                          .select('profile name email image userRole status')
                          .lean() as UserDocument | null

    if (!user) {
      console.log('User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        ...user.profile,
        name: user.name,
        email: user.email,
        image: user.image,
        userRole: user.userRole,
        role: user.profile?.role,
        status: user.status,
        stats: user.profile?.stats || {
          experimentsCompleted: 0,
          totalExperimentTime: 0,
          lastActive: new Date()
        }
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const data = await req.json()
    
    // Filter empty social links
    const social = data.social ? {
      twitter: data.social.twitter || '',
      linkedin: data.social.linkedin || '',
      github: data.social.github || ''
    } : undefined

    const updateData: ProfileUpdateData = {
      'profile.bio': data.bio,
      'profile.institution': data.institution,
      'profile.role': data.role,
      'profile.expertise': data.expertise,
      ...(social && {
        'profile.social': social
      })
    }

    // Remove undefined/null values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        select: 'profile name email image userRole status'
      }
    ).lean() as UserDocument | null

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        ...user.profile,
        name: user.name,
        email: user.email,
        image: user.image,
        userRole: user.userRole,
        role: user.profile?.role,
        status: user.status,
        stats: user.profile?.stats || {
          experimentsCompleted: 0,
          totalExperimentTime: 0,
          lastActive: new Date()
        }
      }
    })
  } catch (error: unknown) {
    console.error('Profile update error:', error)
    
    // Handle mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as ValidationError
      const validationErrors = Object.values(validationError.errors)
        .map(err => err.message)
      
      return NextResponse.json({ 
        error: 'Validation failed',
        message: validationErrors.join('. '),
        validationErrors
      }, { status: 400 })
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      },
      { status: 500 }
    )
  }
}