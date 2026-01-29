
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Test Enviroment Variables (Masked)
        const envStatus = {
            GoogleID_Exists: !!process.env.GOOGLE_CLIENT_ID,
            GoogleID_Length: process.env.GOOGLE_CLIENT_ID?.length || 0,
            GoogleSecret_Exists: !!process.env.GOOGLE_CLIENT_SECRET,
            NextAuthUrl: process.env.NEXTAUTH_URL,
            ResendKey_Exists: !!process.env.RESEND_API_KEY,
            CloudinaryKey_Exists: !!process.env.CLOUDINARY_API_KEY,
            DatabaseUrl_Exists: !!process.env.DATABASE_URL,
        };

        // 2. Test Database Connection
        const userCount = await prisma.user.count();
        const eventCount = await prisma.event.count();

        return NextResponse.json(
            {
                status: "success",
                message: "Database connected successfully",
                data: { userCount, eventCount },
                env: envStatus
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Database connection failed:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Database connection failed",
                error: error.message,
                stack: error.stack
            },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
