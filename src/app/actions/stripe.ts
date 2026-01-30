"use server";

import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const FEATURED_PRICE_ID = process.env.STRIPE_PRICE_ID_FEATURED || "price_1Q..."; // Fallback for dev

export async function createFeaturedUpgradeSession(eventId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Verify ownership
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { organizer: true }
    });

    if (!event || event.organizer.userId !== session.user.id) {
        throw new Error("You do not own this event.");
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Featured Event Listing",
                        description: "Standard + Homepage Feature, Top of Search, Weekly Email (30 Days).",
                    },
                    unit_amount: 9900, // $99.00
                },
                quantity: 1,
            },
        ],
        metadata: {
            eventId,
            userId: session.user.id,
            type: "EVENT_FEATURED"
        },
        success_url: `${process.env.NEXTAUTH_URL}/events/${eventId}?upgrade=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/events/${eventId}?upgrade=cancel`,
    });

    if (checkoutSession.url) {
        redirect(checkoutSession.url);
    }
}
