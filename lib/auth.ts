import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { db } from "@/lib/db"
import nodemailer from "nodemailer"
import { createTransport } from "nodemailer"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        const transport = createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        try {
          await transport.sendMail({
            to: identifier,
            subject: "Sign up for KairoAgent",
            text: `Click here to sign up: ${url}`,
            html: `<p>Click <a href="${url}">here</a> to sign up.</p>`,
          });
        } catch (error) {
          console.error("Error sending verification email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await db.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
              },
            })
          }
          return true
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }

      if (account?.provider === "email") {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await db.user.create({
              data: {
                email: user.email!,
                name: user.name,
              },
            })
          }
          return true
        } catch (error) {
          console.error("Error in email signIn callback:", error)
          return false
        }
      }

      return true
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  basePath: process.env.NEXTAUTH_URL || "http://localhost:3001",
} 