"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
    const user = await getCurrentUser();
    const userWithRole = user as { id: string; role: string; email?: string | null };

    if (!userWithRole || userWithRole.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return userWithRole;
}

export async function updateEventStatus(formData: FormData) {
    await verifyAdmin();
    const eventId = formData.get("eventId") as string;
    const newStatus = formData.get("status") as string;

    if (!["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "EXPIRED"].includes(newStatus)) {
        throw new Error("Invalid status");
    }

    await prisma.event.update({
        where: { id: eventId },
        data: { status: newStatus }
    });

    revalidatePath("/admin/all-events");
}

export async function deleteEvent(formData: FormData) {
    await verifyAdmin();
    const eventId = formData.get("eventId") as string;

    await prisma.event.delete({
        where: { id: eventId }
    });

    revalidatePath("/admin/all-events");
}
