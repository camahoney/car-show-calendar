import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const now = new Date();

        // Find and update events that have ended and are not yet marked as COMPLETED or EXPIRED
        // We only want to expire APPROVED events.
        const result = await prisma.event.updateMany({
            where: {
                endDateTime: {
                    lt: now,
                },
                status: "APPROVED",
            },
            data: {
                status: "EXPIRED", // Or "COMPLETED" if you prefer to distinguish
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
