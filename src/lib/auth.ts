import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

console.log("Auth Options Initializing...");
try {
    console.log("Prisma Client exists:", !!prisma);
    console.log("Prisma User Model exists:", !!prisma.user);
} catch (e) {
    console.error("Error checking Prisma:", e);
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user;
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),
        EmailProvider({
            server: {
                host: "smtp.resend.com",
                port: 465,
                auth: {
                    user: "resend",
                    pass: process.env.RESEND_API_KEY,
                },
            },
            from: "onboarding@resend.dev", // Default Resend testing email
        }),
        // Development only provider to allow login without keys
        CredentialsProvider({
            name: "Dev User",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "user@example.com" },
            },
            async authorize(credentials) {
                // if (process.env.NODE_ENV === "production") return null;
                if (!credentials?.email) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (user) return user;
                return null; // Only allow existing seeded users
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("SignIn Callback:", { userEmail: user.email, provider: account?.provider });
            return true;
        },
        async session({ session, user, token }) {
            try {
                if (session.user) {
                    // Fetch fresh user data to include role
                    const dbUser = await prisma.user.findUnique({
                        where: { email: session.user.email! },
                    });
                    if (dbUser) {
                        session.user.id = dbUser.id;
                        session.user.role = dbUser.role;
                    }
                }
            } catch (e) {
                console.error("Session Callback Error:", e);
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;

                token.role = user.role;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt", // Use JWT strategy for easier middleware role checks
    },
    pages: {
        signIn: "/signin",
    },
    debug: true,
};
