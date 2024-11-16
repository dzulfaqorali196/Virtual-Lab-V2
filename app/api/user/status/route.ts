import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/mongodb"
import { updateUserStatus } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()
    await updateUserStatus(session.user.email, status)

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error('Error updating status:', error)
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    )
  }
} 