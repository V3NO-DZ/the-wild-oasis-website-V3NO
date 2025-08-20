import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { createGuest, getGuest } from "./data-service";

// // Debugging logs (remove in production)
// console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
// console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // Map 'sub' to 'id' for NextAuth compatibility
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email ?? null;
        const fullName = user.name ?? "";

        if (!email) {
          return false;
        }

        const existingGuest = await getGuest(email);
        if (!existingGuest) {
          await createGuest({ email, fullName });
        }

        return true;
      } catch (err) {
        return false;
      }
    },
    async session({ session }) {
      if (!session.user?.email) {
        return session;
      }

      const guest = await getGuest(session.user.email);
      if (guest?.id) {
        (session.user as any).guestId = guest.id as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
