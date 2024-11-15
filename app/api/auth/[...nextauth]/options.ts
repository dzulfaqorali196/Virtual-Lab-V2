import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { OAuthAccount, UserAccount, CreateUserData } from "@/types/auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !user?.email) return false;
      
      try {
        await connectDB();
        let dbUser = await User.findOne({ email: user.email });
        
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            accounts: [{
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              token_type: account.token_type,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              scope: account.scope,
              id_token: account.id_token
            }],
            profile: {
              bio: "",
              institution: "",
              role: "",
              expertise: [],
              social: {
                twitter: "",
                linkedin: "",
                github: ""
              }
            }
          });
        } else {
          const accountExists = dbUser.accounts?.some((acc: { provider: string; providerAccountId: string }) => 
            acc.provider === account.provider && 
            acc.providerAccountId === account.providerAccountId
          );

          if (!accountExists && dbUser.accounts) {
            dbUser.accounts.push({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              token_type: account.token_type,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              scope: account.scope,
              id_token: account.id_token
            });
            await dbUser.save();
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.profile = user.profile;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'user' | 'moderator' | 'admin';
        session.user.status = token.status as 'active' | 'suspended' | 'banned';
        session.user.profile = token.profile as typeof session.user.profile;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  
  events: {
    async signOut({ token }) {
      try {
        if (token?.id) {
          await connectDB();
          await User.findByIdAndUpdate(token.id, {
            lastLogin: new Date()
          });
        }
      } catch (error) {
        console.error('SignOut event error:', error);
      }
    }
  }
} 