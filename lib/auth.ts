import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Mock OTP storage (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export const authOptions = {
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    
    // Email/Password Provider
    Credentials({
      id: 'credentials',
      name: 'Email/Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('И-мэйл болон нууц үг оруулна уу');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('И-мэйл эсвэл нууц үг буруу байна');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('И-мэйл эсвэл нууц үг буруу байна');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    
    // Phone OTP Provider (Twilio SMS)
    Credentials({
      id: 'phone-login',
      name: 'Phone Login',
      credentials: {
        phoneNumber: { label: 'Phone Number', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.otp) {
          throw new Error('Утасны дугаар болон код оруулна уу');
        }

        // Verify OTP using Twilio
        const { verifyPhoneOTP } = await import('@/lib/twilio');
        const verification = await verifyPhoneOTP(
          credentials.phoneNumber as string,
          credentials.otp as string
        );

        if (!verification.success) {
          throw new Error(verification.error || 'Код буруу байна');
        }

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { phoneNumber: credentials.phoneNumber as string },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              phoneNumber: credentials.phoneNumber as string,
              name: `Хэрэглэгч ${credentials.phoneNumber}`,
            },
          });
        }

        return {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Find or create user for Google OAuth
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.phoneNumber = (user as any).phoneNumber;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          phoneNumber: token.phoneNumber as string,
          image: token.image as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Legacy function - now using Twilio
// Kept for backwards compatibility
export async function sendOTP(phoneNumber: string): Promise<boolean> {
  const { sendPhoneOTP } = await import('@/lib/twilio');
  const result = await sendPhoneOTP(phoneNumber);
  return result.success;
}
