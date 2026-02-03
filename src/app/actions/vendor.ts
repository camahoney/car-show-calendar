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
    subscriptionTier?: "FREE" | "PRO"; // New parameter
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
                slug: `${slug}-${Date.now()}`,
                category: data.category,
                description: data.description,
                city: data.city,
                state: data.state,
                logoUrl: data.logoUrl,
                website: data.website,
                verifiedStatus: "PENDING",
                subscriptionTier: "FREE" // Force FREE initially. Upgrade happens via Webhook.
            }
        });

        // Handle PRO Payment
        if (data.subscriptionTier === "PRO") {
            // Import stripe lazily to avoid circular issues if any? No, import at top.
            // But we need to define stripe price id.
            const priceId = process.env.STRIPE_VENDOR_PRO_PRICE_ID;

            if (priceId) {
                const { stripe } = await import("@/lib/stripe");
                const session = await stripe.checkout.sessions.create({
                    mode: "subscription",
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price: priceId,
                            quantity: 1,
                        },
                    ],
                    metadata: {
                        type: "VENDOR_SUBSCRIPTION",
                        vendorId: vendor.id,
                        userId: user.id,
                        tier: "PRO"
                    },
                    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendors/${vendor.slug}?success=true`,
                    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendors/register?canceled=true`,
                    customer_email: user.email || undefined
                });

                if (session.url) {
                    return { success: true, redirectUrl: session.url, data: vendor };
                }
            } else {
                console.warn("Missing STRIPE_VENDOR_PRO_PRICE_ID, creating as PRO but no payment charged.");
            }
        }

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

// Admin Actions
export async function getAdminVendors() {
    const user = await getCurrentUser();
    // @ts-ignore
    if (!user || user.role !== 'ADMIN') return { success: false, error: "Unauthorized" };

    try {
        const vendors = await prisma.vendor.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });
        return { success: true, data: vendors };
    } catch (error) {
        console.error("Admin fetch failed:", error);
        return { success: false, error: "Failed to fetch vendors" };
    }
}

export async function toggleVendorStatus(vendorId: string, status: string) {
    const user = await getCurrentUser();
    // @ts-ignore
    if (!user || user.role !== 'ADMIN') return { success: false, error: "Unauthorized" };

    try {
        await prisma.vendor.update({
            where: { id: vendorId },
            data: { verifiedStatus: status }
        });
        revalidatePath("/admin/vendors");
        return { success: true };
    } catch (error) {
        console.error("Status update failed:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function updateVendorTier(vendorId: string, tier: string) {
    const user = await getCurrentUser();
    // @ts-ignore
    if (!user || user.role !== 'ADMIN') return { success: false, error: "Unauthorized" };

    try {
        await prisma.vendor.update({
            where: { id: vendorId },
            data: { subscriptionTier: tier }
        });
        revalidatePath("/admin/vendors");
        return { success: true };
    } catch (error) {
        console.error("Tier update failed:", error);
        return { success: false, error: "Failed to update tier" };
    }
}

export async function deleteVendor(vendorId: string) {
    const user = await getCurrentUser();
    // @ts-ignore
    if (!user || user.role !== 'ADMIN') return { success: false, error: "Unauthorized" };

    try {
        await prisma.vendor.delete({
            where: { id: vendorId }
        });
        revalidatePath("/admin/vendors");
        return { success: true };
    } catch (error) {
        console.error("Delete failed:", error);
        return { success: false, error: "Failed to delete vendor" };
    }
}


export async function boostEventByVendor(eventId: string, vendorId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // Import stripe
        const { stripe } = await import("@/lib/stripe");
        const priceId = process.env.STRIPE_VENDOR_BOOST_PRICE_ID;

        if (!priceId) {
            return { success: false, error: "Configuration Error: Vendor Boost Price ID missing." };
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment", // One-time payment
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                type: "VENDOR_BOOST",
                vendorId: vendorId,
                eventId: eventId,
                userId: user.id,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}?boost_success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}?boost_canceled=true`,
            customer_email: user.email || undefined
        });

        if (session.url) {
            return { success: true, redirectUrl: session.url };
        } else {
            return { success: false, error: "Failed to create checkout session" };
        }

    } catch (error) {
        console.error("Boost initialization failed:", error);
        return { success: false, error: "Failed to start boost process" };
    }
}
