export interface OAuthAccount {
  provider: string;
  providerAccountId: string;
  type?: string;
  access_token?: string;
  token_type?: string;
  expires_at?: number;
  refresh_token?: string | null;
  scope?: string;
  id_token?: string;
}

export interface UserAccount {
  name?: string | null;
  email: string;
  image?: string | null;
  accounts?: OAuthAccount[];
  profile?: {
    bio: string;
    institution: string;
    role: string;
    expertise: string[];
    social: {
      twitter: string;
      linkedin: string;
      github: string;
    };
  };
}

export interface CreateUserData extends UserAccount {
  name: string | null;
  email: string;
  image: string | null;
  accounts: OAuthAccount[];
  profile: {
    bio: string;
    institution: string;
    role: string;
    expertise: string[];
    social: {
      twitter: string;
      linkedin: string;
      github: string;
    };
  };
} 