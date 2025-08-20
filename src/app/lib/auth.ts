import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { createGuest, getGuest } from "./data-service";

export const authConfig: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email ?? null;
        const fullName = user.name ?? "";
        if (!email) return false;

        const existingGuest = await getGuest(email);
        if (!existingGuest) await createGuest({ email, fullName });

        return true;
      } catch (err) {
        return false;
      }
    },
    async session({ session, user }) {
      if (!session.user?.email) return session;
      const guest = await getGuest(session.user.email);
      if (guest?.id) (session.user as any).guestId = guest.id as number;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
};
