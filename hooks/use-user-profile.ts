import { create } from "zustand"
import { toast } from "sonner"
import { z } from "zod"

// Validation schema
const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  institution: z.string().max(100).optional(),
  role: z.string().max(50).optional(),
  expertise: z.array(z.string().max(30)).max(5).optional(),
  social: z.object({
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal(""))
  }).optional()
})

interface UserStats {
  experimentsCompleted: number;
  totalExperimentTime: number;
  lastActive: number;
}

export interface UserProfile {
  bio?: string;
  institution?: string;
  role?: string;
  expertise?: string[];
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: number;
  }>;
  stats: UserStats;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface ProfileState {
  bio?: string;
  institution?: string;
  role?: string;
  expertise?: string[];
  achievements?: UserProfile['achievements'];
  stats?: UserStats;
  social?: UserProfile['social'];
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
  resetState: () => void;
}

export const useUserProfile = create<ProfileState>((set) => ({
  isLoading: false,
  error: null,

  updateProfile: async (data) => {
    try {
      // Validate data before sending
      const validatedData = profileSchema.parse(data);
      
      set({ isLoading: true, error: null });
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      set({ 
        ...updatedProfile, 
        isLoading: false, 
        error: null 
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      set({ isLoading: false, error: errorMessage });
      toast.error(errorMessage);
    }
  },

  loadProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/user/profile");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load profile");
      }

      const profile = await response.json();
      set({ 
        ...profile, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load profile";
      set({ isLoading: false, error: errorMessage });
      toast.error(errorMessage);
    }
  },

  // Reset state when logging out
  resetState: () => {
    set({
      bio: undefined,
      institution: undefined,
      role: undefined,
      expertise: undefined,
      achievements: undefined,
      stats: undefined,
      social: undefined,
      isLoading: false,
      error: null
    });
  }
}));