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

    const defaultPreferences: UserPreferences = {
      theme: 'system',
      notifications: true,
      experimentSettings: {
        autoSave: true,
        showTips: true
      }
    }

    return NextResponse.json(user?.preferences || defaultPreferences)
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

    const preferences: UserPreferences = await request.json()
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { preferences } },
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