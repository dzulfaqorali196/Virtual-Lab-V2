export interface UserPreferences {
  theme: string
  simulationSettings: {
    length: number
    mass: number
    angle: number
    isCustom?: boolean
  }
  view3D: boolean
  notifications: {
    email: boolean
    push: boolean
  }
  experimentSettings: {
    autoSave: boolean
    showTips: boolean
  }
}

export interface PreferencesState {
  preferences: UserPreferences
  isLoading: boolean
  error: string | null
  setPreferences: (preferences: Partial<UserPreferences>) => Promise<void>
  loadPreferences: () => Promise<void>
  view3D: boolean
  setPreference: (key: keyof UserPreferences, value: any) => Promise<void>
  defaultLength: number
  defaultMass: number
  defaultAngle: number
}

export interface UserAchievement {
  id: string
  name: string
  description: string
  earnedAt: string | number | Date
}

export interface UserStats {
  experimentsCompleted: number
  totalExperimentTime: number
  lastActive: string | number | Date
}

export interface UserSocial {
  twitter?: string
  linkedin?: string
  github?: string
}

export interface UserProfile {
  bio?: string
  institution?: string
  role?: string
  expertise?: string[]
  social?: UserSocial
  stats?: UserStats
  achievements?: UserAchievement[]
  preferences?: UserPreferences
}

export interface ProfileUpdateData {
  bio?: string
  institution?: string
  role?: string
  expertise?: string[]
  social?: UserSocial
} 