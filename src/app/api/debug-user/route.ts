
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const email = "deathlesscourage@gmail.com";

        const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true, sessions: true }
        });

        if (!user) {
            return NextResponse.json({ status: "User Not Found" });
        }

        return NextResponse.json({
            status: "Found",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                accountsCount: user.accounts.length,
                accounts: user.accounts, // See if provider is google
                updatedAt: user.updatedAt
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
