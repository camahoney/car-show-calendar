"use server";

import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "./settings";

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

    const settings = await getSystemSettings();
    const priceAmount = Math.round(settings.featuredEventPrice * 100);

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Featured Event Listing",
                        description: `Standard + Homepage Feature, Top of Search, Weekly Email (${settings.featuredEventDurationDays} Days).`,
                    },
                    unit_amount: priceAmount >= 50 ? priceAmount : 1999, // Enforce min 50 cents, fallback to $19.99
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

export async function createStandardUpgradeSession(eventId: string) {
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

    const settings = await getSystemSettings();
    const priceAmount = Math.round(settings.standardEventPrice * 100);

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Standard Event Listing",
                        description: "Full Page, Poster, Links, Analytics.",
                    },
                    unit_amount: priceAmount >= 50 ? priceAmount : 2900, // Enforce min 50 cents, fallback to $29.00
                },
                quantity: 1,
            },
        ],
        metadata: {
            eventId,
            userId: session.user.id,
            type: "EVENT_STANDARD"
        },
        success_url: `${process.env.NEXTAUTH_URL}/events/${eventId}?upgrade=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/events/${eventId}?upgrade=cancel`,
    });

    if (checkoutSession.url) {
        redirect(checkoutSession.url);
    }
}
