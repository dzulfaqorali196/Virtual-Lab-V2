import { create } from "zustand"
import { toast } from "sonner"

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
}

interface ProfileState {
  bio?: string;
  institution?: string;
  role?: string;
  expertise?: string[];
  achievements?: UserProfile['achievements'];
  stats?: UserStats;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const useUserProfile = create<ProfileState>((set) => ({
  isLoading: false,
  error: null,

  updateProfile: async (data) => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();
      set({ ...updatedProfile, isLoading: false, error: null });
      toast.success("Profile updated successfully");
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      toast.error("Failed to update profile");
    }
  },

  loadProfile: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/user/profile");
      
      if (!response.ok) throw new Error("Failed to load profile");

      const profile = await response.json();
      set({ ...profile, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      toast.error("Failed to load profile");
    }
  },
}))