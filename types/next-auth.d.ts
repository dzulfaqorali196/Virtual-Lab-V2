import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: 'user' | 'moderator' | 'admin';
      status?: 'active' | 'suspended' | 'banned';
      profile?: {
        bio?: string;
        institution?: string;
        role?: string;
        expertise?: string[];
        social?: {
          twitter?: string;
          linkedin?: string;
          github?: string;
        };
        stats?: {
          experimentsCompleted: number;
          totalExperimentTime: number;
          lastActive: Date;
        };
      };
    }
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    accounts?: Array<{
      provider: string;
      providerAccountId: string;
      access_token?: string;
      expires_at?: number;
      refresh_token?: string;
      scope?: string;
    }>;
    preferences?: {
      theme?: string;
      defaultLength?: number;
      defaultMass?: number;
      defaultAngle?: number;
      view3D?: boolean;
      notifications?: {
        email?: boolean;
        push?: boolean;
      };
    };
    profile?: {
      bio?: string;
      institution?: string;
      role?: string;
      expertise?: string[];
      social?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
      };
      stats?: {
        experimentsCompleted: number;
        totalExperimentTime: number;
        lastActive: Date;
      };
    };
    role?: 'user' | 'moderator' | 'admin';
    status?: 'active' | 'suspended' | 'banned';
    lastLogin?: Date;
    loginAttempts?: number;
    lockUntil?: Date;
  }
  interface JWT {
    id: string
    role?: string
    accessToken?: string
  }
}