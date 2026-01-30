"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const vehicleSchema = z.object({
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    make: z.string().min(1),
    model: z.string().min(1),
    nickname: z.string().optional(),
    photoUrl: z.string().url().optional().or(z.literal("")),
});

export async function addVehicle(data: any) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    const result = vehicleSchema.safeParse(data);
    if (!result.success) {
        return { error: "Validation failed" };
    }

    try {
        const vehicle = await prisma.vehicle.create({
            data: {
                userId: session.user.id,
                ...result.data,
            }
        });

        revalidatePath("/garage");
        return { success: true, vehicle };
    } catch (error) {
        console.error("Add vehicle error:", error);
        return { error: "Failed to add vehicle" };
    }
}

export async function getMyVehicles() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return [];
    }

    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });
        return vehicles;
    } catch (error) {
        return [];
    }
}
