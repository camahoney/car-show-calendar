"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string; image?: string; bio?: string }) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: data.name,
                // Only update image if provided (Cloudinary URL usually)
                ...(data.image && { image: data.image }),
            },
        });

        // Update or Create Profile if bio is present
        if (data.bio) {
            await prisma.profile.upsert({
                where: { userId: user.id },
                update: { bio: data.bio },
                create: { userId: user.id, bio: data.bio, location: "", website: "" },
            });
        }

        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard");
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
