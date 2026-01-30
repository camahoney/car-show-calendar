"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { VendorCategory } from "@prisma/client";

export async function getVendors(filter?: { category?: VendorCategory, query?: string }) {
    try {
        const where: any = {
            verifiedStatus: "VERIFIED" // Only show verified vendors publicly? Or show all for now? stick to "VERIFIED" usually, but for demo maybe all. Let's use all for now as user just created db.
        };

        // For demo purposes, we might want to relax "VERIFIED" check if there are no verified vendors yet.
        // But better to be strict and maybe have a "pending" section for admins.
        // Let's comment out verify check for dev speed so user sees their own creations immediately.
        // where.verifiedStatus = "VERIFIED";

        if (filter?.category) {
            where.category = filter.category;
        }

        if (filter?.query) {
            where.OR = [
                { businessName: { contains: filter.query, mode: "insensitive" } },
                { description: { contains: filter.query, mode: "insensitive" } },
                { city: { contains: filter.query, mode: "insensitive" } }
            ];
        }

        const vendors = await prisma.vendor.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                reviews: true
            }
        });

        return { success: true, data: vendors };
    } catch (error) {
        console.error("Failed to fetch vendors:", error);
        return { success: false, error: "Failed to load vendors" };
    }
}

export async function registerVendor(data: {
    businessName: string;
    category: VendorCategory;
    description: string;
    city: string;
    state: string;
    logoUrl?: string;
    website?: string;
}) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const existing = await prisma.vendor.findUnique({
            where: { userId: user.id }
        });

        if (existing) return { success: false, error: "You already have a vendor profile" };

        const slug = data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const vendor = await prisma.vendor.create({
            data: {
                userId: user.id,
                businessName: data.businessName,
                slug: `${slug}-${Date.now()}`, // Ensure uniqueness
                category: data.category,
                description: data.description,
                city: data.city,
                state: data.state,
                logoUrl: data.logoUrl,
                website: data.website,
                verifiedStatus: "PENDING"
            }
        });

        revalidatePath("/vendors");
        return { success: true, data: vendor };
    } catch (error) {
        console.error("Registration failed:", error);
        return { success: false, error: "Failed to register vendor" };
    }
}

export async function updateVendor(data: {
    businessName: string;
    category: VendorCategory;
    description: string;
    city: string;
    state: string;
    logoUrl?: string;
    bannerUrl?: string;
    website?: string;
    email?: string;
    phone?: string;
    instagram?: string;
}) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const vendor = await prisma.vendor.update({
            where: { userId: user.id },
            data: {
                ...data,
                // Don't update slug for now to avoid URL breaking, or handle redirect if we do. 
                // Let's keep slug stable.
            }
        });

        revalidatePath(`/vendors/${vendor.slug}`);
        return { success: true, data: vendor };
    } catch (error) {
        console.error("Update failed:", error);
        return { success: false, error: "Failed to update vendor profile" };
    }
}

export async function getMyVendor() {
    const user = await getCurrentUser();
    if (!user) return null;

    return prisma.vendor.findUnique({
        where: { userId: user.id }
    });
}
