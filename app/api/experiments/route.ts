import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Experiment from "@/models/Experiment";
import { saveExperimentAndUpdateStats } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const data = await req.json()
    const experiment = await saveExperimentAndUpdateStats({
      ...data,
      userId: session.user.email
    })
    
    return NextResponse.json({ success: true, experiment })
  } catch (error) {
    console.error('Error saving experiment:', error)
    return NextResponse.json({ 
      error: 'Failed to save experiment' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const experiment = await Experiment.findOneAndDelete({
      _id: params.id,
      userId: session.user.email
    })

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Experiment deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete experiment" },
      { status: 500 }
    )
  }
} 