export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  earnedAt: string | number | Date;
}

export interface UserStats {
  experimentsCompleted: number;
  totalExperimentTime: number;
  lastActive: string | number | Date;
}

export interface UserSocial {
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export interface UserProfile {
  bio?: string;
  institution?: string;
  role?: string;
  expertise?: string[];
  social?: UserSocial;
  stats?: UserStats;
  achievements?: UserAchievement[];
}

export interface ProfileUpdateData {
  bio?: string;
  institution?: string;
  role?: string;
  expertise?: string[];
  social?: UserSocial;
}