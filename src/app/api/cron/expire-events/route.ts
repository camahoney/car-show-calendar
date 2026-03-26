import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const now = new Date();

        // Find and update events whose start date has passed (before start of today)
        // Events expire the day after their start date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await prisma.event.updateMany({
            where: {
                startDateTime: {
                    lt: today,
                },
                status: { in: ["APPROVED", "SUBMITTED", "PUBLISHED"] },
            },
            data: {
                status: "EXPIRED",
            },
        });

        // Also remove featured status from events where featuredUntil < now
        const featuredResult = await prisma.event.updateMany({
            where: {
                featuredUntil: {
                    lt: now
                },
                tier: "FEATURED"
            },
            data: {
                tier: "STANDARD",
                featuredUntil: null
            }
        });

        return NextResponse.json({
            expiredEvents: result.count,
            removedFeatured: featuredResult.count,
            message: "Events status updated successfully"
        });
    } catch (error) {
        console.error("Error in expire-events cron:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
