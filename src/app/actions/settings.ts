"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
    featuredEventPrice: z.number().min(0),
    standardEventPrice: z.number().min(0),
    featuredEventDurationDays: z.number().int().min(1),
    enableRegistration: z.boolean(),
    maintenanceMode: z.boolean(),
    supportEmail: z.string().email().optional().nullable().or(z.literal("")),
})

export async function getSystemSettings() {
    let settings = await prisma.systemSettings.findUnique({
        where: { id: "default" }
    })

    if (!settings) {
        // Create default if not exists
        settings = await prisma.systemSettings.create({
            data: {
                id: "default",
                featuredEventPrice: 19.99,
                standardEventPrice: 0.00, // Explicitly 0 default
                featuredEventDurationDays: 30,
                enableRegistration: true,
                maintenanceMode: false,
            }
        })
    }
    return settings
}

export async function updateSystemSettings(data: z.infer<typeof settingsSchema>) {
    try {
        const validated = settingsSchema.parse(data)

        await prisma.systemSettings.update({
            where: { id: "default" },
            data: {
                ...validated,
                supportEmail: validated.supportEmail || null
            }
        })

        revalidatePath("/admin/settings")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to update settings:", error)
        return { success: false, error: "Failed to update settings" }
    }
}
