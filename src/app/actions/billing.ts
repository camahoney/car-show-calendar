"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function activateStandardListing(eventId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // Verify Organizer Status
        const organizer = await prisma.organizerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!organizer || organizer.verifiedStatus !== "VERIFIED") {
            return { success: false, error: "Active Season Pass (Verified Organizer) required." };
        }

        // Update Event
        await prisma.event.update({
            where: { id: eventId, organizerId: organizer.id },
            data: { tier: "STANDARD" }
        });

        revalidatePath("/dashboard/billing");
        revalidatePath("/dashboard/events");
        return { success: true };
    } catch (error) {
        console.error("Activation failed:", error);
        return { success: false, error: "Failed to activate listing" };
    }
}
