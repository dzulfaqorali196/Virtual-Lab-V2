import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { updateUserProfile, getUserProfile } from "@/lib/db"
import { z } from "zod"
import mongoose from "mongoose"

// Validation schema for profile data with custom error messages
const profileSchema = z.object({
  bio: z.string().max(500, {
    message: "Bio cannot be longer than 500 characters"
  }).optional(),
  institution: z.string().max(100, {
    message: "Institution name cannot be longer than 100 characters"
  }).optional(),
  role: z.string().max(50, {
    message: "Role cannot be longer than 50 characters"
  }).optional(),
  expertise: z.array(z.string().max(30, {
    message: "Each expertise cannot be longer than 30 characters"
  })).max(5, {
    message: "You can only add up to 5 areas of expertise"
  }).optional(),
  social: z.object({
    twitter: z.string().url({ message: "Invalid Twitter URL" }).optional().or(z.literal("")),
    linkedin: z.string().url({ message: "Invalid LinkedIn URL" }).optional().or(z.literal("")),
    github: z.string().url({ message: "Invalid GitHub URL" }).optional().or(z.literal(""))
  }).optional()
})

// Helper function for error responses
const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json(
    { error: message },
    { status }
  )
}

// GET: Fetch user profile
export async function GET() {
    try {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return errorResponse("Unauthorized", 401)
      }
  
      const profile = await getUserProfile(session.user.id)
      if (!profile) {
        // Cek apakah ini karena invalid ID atau memang tidak ditemukan
        if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
          console.warn('Invalid ObjectId format:', session.user.id);
        }
        return errorResponse("Profile not found", 404)
      }
  
      return NextResponse.json(profile)
    } catch (error) {
      console.error("Error fetching profile:", error)
      // Handle specific MongoDB errors
      if (error instanceof mongoose.Error.CastError) {
        return errorResponse("Invalid user ID format", 400)
      }
      return errorResponse(
        "An error occurred while fetching profile",
        500
      )
    }
  }

// PUT: Update user profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    // Validate content type
    const contentType = req.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      return errorResponse("Invalid content type. Expected application/json")
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = profileSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({
        error: "Invalid data",
        details: validatedData.error.issues.map(issue => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      }, { status: 400 })
    }

    // Remove empty strings from social URLs
    if (validatedData.data.social) {
      Object.keys(validatedData.data.social).forEach(key => {
        const k = key as keyof typeof validatedData.data.social
        if (validatedData.data.social![k] === "") {
          delete validatedData.data.social![k]
        }
      })
    }

    // Update profile in database
    const updatedProfile = await updateUserProfile(
      session.user.id,
      validatedData.data
    )

    if (!updatedProfile) {
      return errorResponse("Failed to update profile")
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("Error updating profile:", error)
    
    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Validation failed",
        details: error.issues
      }, { status: 400 })
    }

    return errorResponse(
      "An error occurred while updating profile",
      500
    )
  }
}