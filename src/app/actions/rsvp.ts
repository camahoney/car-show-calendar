"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function rsvpEvent(eventId: string, vehicleId?: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.eventRSVP.upsert({
            where: {
                eventId_userId: {
                    eventId,
                    userId: session.user.id
                }
            },
            update: {
                vehicleId: vehicleId || null,
                status: "GOING"
            },
            create: {
                eventId,
                userId: session.user.id,
                vehicleId: vehicleId || null,
                status: "GOING"
            }
        });

        revalidatePath(`/events/${eventId}`);
        return { success: true };
    } catch (error) {
        console.error("RSVP error:", error);
        return { error: "Failed to RSVP" };
    }
}

export async function removeRsvp(eventId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.eventRSVP.delete({
            where: {
                eventId_userId: {
                    eventId,
                    userId: session.user.id
                }
            }
        });
        revalidatePath(`/events/${eventId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to remove RSVP" };
    }
}
