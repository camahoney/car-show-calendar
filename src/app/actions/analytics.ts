"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getOrganizerStats() {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // Must look up organizer profile first — organizerId on events is the profile ID, not user ID
        const organizerProfile = await prisma.organizerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!organizerProfile) {
            return { success: false, error: "No organizer profile found" };
        }

        const events = await prisma.event.findMany({
            where: { organizerId: organizerProfile.id },
            select: {
                id: true,
                title: true,
                slug: true,
                views: true,
                clicks: true,
                status: true,
                tier: true,
                startDateTime: true,
                endDateTime: true,
                createdAt: true,
                city: true,
                state: true,
                _count: {
                    select: {
                        saves: true,
                        votes: true
                    }
                }
            },
            orderBy: { views: "desc" }
        });

        // Aggregates
        const totalViews = events.reduce((acc, e) => acc + e.views, 0);
        const totalClicks = events.reduce((acc, e) => acc + e.clicks, 0);
        const totalSaves = events.reduce((acc, e) => acc + e._count.saves, 0);
        const totalVotes = events.reduce((acc, e) => acc + e._count.votes, 0);

        // Conversion rate (clicks / views)
        const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100) : 0;

        // Per-event detailed table (all events, sorted by views)
        const eventDetails = events.map(e => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            views: e.views,
            clicks: e.clicks,
            saves: e._count.saves,
            votes: e._count.votes,
            status: e.status,
            tier: e.tier,
            conversionRate: e.views > 0 ? ((e.clicks / e.views) * 100) : 0,
            startDate: e.startDateTime.toISOString(),
            location: `${e.city}, ${e.state}`,
        }));

        // Bar chart data (top 10)
        const eventPerformance = eventDetails.slice(0, 10).map(e => ({
            name: e.title.substring(0, 18) + (e.title.length > 18 ? "…" : ""),
            views: e.views,
            clicks: e.clicks,
            saves: e.saves,
        }));

        // Status breakdown for pie/donut
        const statusBreakdown = events.reduce((acc, e) => {
            const s = e.status || "DRAFT";
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Tier breakdown
        const tierBreakdown = events.reduce((acc, e) => {
            const t = e.tier || "FREE_BASIC";
            acc[t] = (acc[t] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            success: true,
            data: {
                totalViews,
                totalClicks,
                totalSaves,
                totalVotes,
                conversionRate,
                eventCount: events.length,
                eventPerformance,
                eventDetails,
                statusBreakdown,
                tierBreakdown,
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
