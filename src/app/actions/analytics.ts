"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getOrganizerStats() {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const events = await prisma.event.findMany({
            where: { organizerId: user.id },
            select: {
                id: true,
                title: true,
                views: true,
                clicks: true,
                createdAt: true, // simplified for "views over time" proxy if we don't have daily analytics table yet
                _count: {
                    select: {
                        saves: true,
                        votes: true
                    }
                }
            }
        });

        // Aggregates
        const totalViews = events.reduce((acc, e) => acc + e.views, 0);
        const totalClicks = events.reduce((acc, e) => acc + e.clicks, 0);
        const totalSaves = events.reduce((acc, e) => acc + e._count.saves, 0);
        const totalVotes = events.reduce((acc, e) => acc + e._count.votes, 0);

        // Chart Data (Mocking daily history for now since we only store totals on Event model)
        // In a real production app, we would have an AnalyticsEvent table tracking daily stats.
        // For V1, we will map individual events as "bars" to show which events are performing best.
        const eventPerformance = events.map(e => ({
            name: e.title.substring(0, 15) + (e.title.length > 15 ? "..." : ""),
            views: e.views,
            clicks: e.clicks
        })).sort((a, b) => b.views - a.views).slice(0, 10); // Top 10

        return {
            success: true,
            data: {
                totalViews,
                totalClicks,
                totalSaves,
                totalVotes,
                eventPerformance
            }
        };

    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return { success: false, error: "Failed to load analytics" };
    }
}

export async function incrementView(eventId: string) {
    try {
        await prisma.event.update({
            where: { id: eventId },
            data: { views: { increment: 1 } },
        });
        revalidatePath(`/events/${eventId}`);
    } catch (error) {
        console.error("Failed to increment view:", error);
    }
}

export async function incrementClick(eventId: string) {
    try {
        await prisma.event.update({
            where: { id: eventId },
            data: { clicks: { increment: 1 } },
        });
    } catch (error) {
        console.error("Failed to increment click:", error);
    }
}
