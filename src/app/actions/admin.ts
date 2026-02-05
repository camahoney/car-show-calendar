"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Ensure only admins can call this (middleware protects /admin routes, but server actions need checks too)
async function ensureAdmin() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function approveEvent(eventId: string) {
    try {
        await ensureAdmin();

        await prisma.event.update({
            where: { id: eventId },
            data: { status: "PUBLISHED" }
        });

        revalidatePath("/admin");
        revalidatePath("/events");
        revalidatePath(`/events/${eventId}`); // In case slug changes or cache logic
        return { success: true };
    } catch (error) {
        console.error("Approve Event Error", error);
        return { success: false, error: "Failed to approve event" };
    }
}

export async function rejectEvent(eventId: string) {
    try {
        await ensureAdmin();

        // Should we delete or set to REJECTED?
        // Let's set to REJECTED for record keeping, or DRAFT if we want them to fix it.
        // For now, DRAFT so they can edit? Or REJECTED if it's spam.
        // Let's act like "Reject" means "Delete" for spam, or "Unpublish".
        // Actually, let's use "REJECTED" status if valid, otherwise DELETE.
        // Schema status is string.
        await prisma.event.update({
            where: { id: eventId },
            data: { status: "REJECTED" }
        });

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Reject Event Error", error);
        return { success: false, error: "Failed to reject event" };
    }
}

export async function getAdminDashboardStats() {
    await ensureAdmin();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newEvents, newUsers] = await Promise.all([
        prisma.event.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { createdAt: true }
        }),
        prisma.user.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { createdAt: true }
        })
    ]);

    // Group by date
    const eventsByDate = newEvents.reduce((acc, curr) => {
        const date = curr.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const usersByDate = newUsers.reduce((acc, curr) => {
        const date = curr.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Fill last 30 days
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        data.push({
            date: dateStr,
            events: eventsByDate[dateStr] || 0,
            users: usersByDate[dateStr] || 0
        });
    }

    return data;
}

export async function getRecentActivity() {
    await ensureAdmin();

    const [recentUsers, recentEvents] = await Promise.all([
        prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, name: true, email: true, createdAt: true, image: true, role: true }
        }),
        prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, title: true, status: true, createdAt: true, organizer: { select: { organizationName: true } } }
        })
    ]);

    return { recentUsers, recentEvents };
}
