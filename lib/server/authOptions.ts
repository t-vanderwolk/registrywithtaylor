import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import type { Role } from '@prisma/client';
import prisma from '@/lib/server/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email + Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
        token.email = user.email ?? '';
        // Cache enrollment tier so middleware can check it without a DB lookup.
        const learner = await prisma.learner.findUnique({
          where:  { email: user.email ?? '' },
          select: { subscriptionTier: true },
        });
        token.tier = learner?.subscriptionTier ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id   = token.id as string;
      session.user.role = token.role as Role;
      session.user.tier = token.tier ?? null;
      // Ensure email is always present on the session
      if (token.email) session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
