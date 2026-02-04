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
