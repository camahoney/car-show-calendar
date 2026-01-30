"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
    const user = await getCurrentUser();
    // Force cast to ensure we can check role property even if type inference fails
    const userWithRole = user as { id: string; role: string; email?: string | null };

    if (!userWithRole || userWithRole.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return userWithRole;
}

export async function updateUserRole(formData: FormData) {
    await verifyAdmin();
    const userId = formData.get("userId") as string;
    const newRole = formData.get("role") as string;

    if (!["USER", "ORGANIZER", "ADMIN"].includes(newRole)) {
        throw new Error("Invalid role");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    });

    revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
    await verifyAdmin();
    const userId = formData.get("userId") as string;

    await prisma.user.delete({
        where: { id: userId }
    });

    revalidatePath("/admin/users");
}

export async function promoteUserToPro(formData: FormData) {
    await verifyAdmin();
    const userId = formData.get("userId") as string;

    // Check if subscription exists
    const existingSub = await prisma.subscription.findFirst({
        where: { userId }
    });

    if (existingSub) {
        await prisma.subscription.update({
            where: { id: existingSub.id },
            data: { status: "active", stripePriceId: "price_pro_manual_override" }
        });
    } else {
        // Create a manual subscription record
        await prisma.subscription.create({
            data: {
                userId,
                stripeSubscriptionId: `sub_manual_${Date.now()}`,
                stripePriceId: "price_pro_manual_override",
                stripeCurrentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 100)), // Lifetime/Long term
                status: "active"
            }
        });
    }

    revalidatePath("/admin/users");
}
