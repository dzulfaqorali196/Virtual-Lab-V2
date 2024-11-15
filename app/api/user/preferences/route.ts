import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  notifications?: boolean
  experimentSettings?: {
    autoSave?: boolean
    showTips?: boolean
  }
  simulationSettings?: {
    length?: number
    mass?: number
    angle?: number
  }
}

interface UserDocument {
  _id: unknown
  email: string
  preferences?: UserPreferences
  __v: number
}

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email })
                          .select('preferences')
                          .lean() as UserDocument

    return NextResponse.json(user?.preferences || {
      theme: 'system',
      notifications: true,
      experimentSettings: {
        autoSave: true,
        showTips: true
      },
      simulationSettings: {
        length: 1.7,
        mass: 0.5,
        angle: 45
      }
    })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: "Failed to fetch user preferences" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          'preferences.simulationSettings': updates.simulationSettings,
          'preferences.experimentSettings': updates.experimentSettings,
          'preferences.theme': updates.theme,
          'preferences.notifications': updates.notifications,
          'preferences.view3D': updates.view3D
        } 
      },
      { new: true, select: 'preferences' }
    ).lean() as UserDocument

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: 400 }
      )
    }

    return NextResponse.json(updatedUser.preferences)
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}