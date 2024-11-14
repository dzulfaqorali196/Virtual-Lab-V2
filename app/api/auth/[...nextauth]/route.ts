import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;
      
      try {
        await connectDB();
        
        // Find existing user
        let dbUser = await User.findOne({ email: user.email });
        
        const currentTime = new Date();
        
        if (!dbUser) {
          // Create new user with required fields and defaults
          const userData = {
            name: user.name,
            email: user.email,
            image: user.image,
            accounts: [{
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              scope: account.scope
            }],
            lastLogin: currentTime,
            profile: {
              bio: "",
              institution: "",
              role: "",
              expertise: [],
              stats: {
                experimentsCompleted: 0,
                totalExperimentTime: 0,
                lastActive: currentTime
              }
            }
          };

          dbUser = await User.create(userData);
        } else {
          // Update existing user
          const existingAccount = dbUser.accounts?.find(
            (acc: any) => acc.provider === account.provider && 
                         acc.providerAccountId === account.providerAccountId
          );

          if (!existingAccount) {
            dbUser.accounts.push({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              scope: account.scope
            });
          }

          // Update login related fields
          dbUser.lastLogin = currentTime;
          if (dbUser.profile?.stats) {
            dbUser.profile.stats.lastActive = currentTime;
          }
          
          await dbUser.save();
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };