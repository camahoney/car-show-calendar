"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addEventPhoto(eventId: string, url: string, caption?: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.eventPhoto.create({
            data: {
                eventId,
                userId: session.user.id,
                url,
                caption,
                status: "APPROVED" // Auto-approve for MVP
            }
        });

        revalidatePath(`/events/${eventId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to add photo:", error);
        return { success: false, error: "Failed to save photo" };
    }
}
