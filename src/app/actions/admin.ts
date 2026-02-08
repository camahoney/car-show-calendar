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

export async function approveEvent(formData: FormData) {
    const eventId = formData.get("eventId") as string;
    if (!eventId) return { success: false, error: "Event ID is required" };

    try {
        await ensureAdmin();

        await prisma.event.update({
            where: { id: eventId },
            data: { status: "APPROVED" } // Using APPROVED as per schema, PUBLISHED might be old enum
        });

        revalidatePath("/admin");
        revalidatePath("/events");
        revalidatePath(`/events/${eventId}`);
    } catch (error) {
        console.error("Approve Event Error", error);
        throw error; // Let Next.js handle the error boundary
    }
}

export async function rejectEvent(formData: FormData) {
    const eventId = formData.get("eventId") as string;
    if (!eventId) throw new Error("Event ID is required");

    try {
        await ensureAdmin();

        await prisma.event.update({
            where: { id: eventId },
            data: { status: "REJECTED" }
        });

        revalidatePath("/admin");
    } catch (error) {
        console.error("Reject Event Error", error);
        throw error;
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
            select: { id: true, title: true, status: true, createdAt: true, organizer: { select: { organizerName: true } } }
        })
    ]);

    return { recentUsers, recentEvents };
}
