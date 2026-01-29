
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    if (!webhookSecret) {
        console.warn("⚠️  Stripe Webhook Secret not set. Skipping verification (DEV MODE ONLY) or failing.");
        return new NextResponse("Webhook Error: STRIPE_WEBHOOK_SECRET is missing", { status: 500 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const metadata = session.metadata;
        if (!metadata) return new NextResponse("No Metadata", { status: 200 });

        const { type, userId, eventId, vendorId } = metadata;

        console.log(`💰 Payment Success: ${type} for User ${userId}`);

        try {
            if (type === "EVENT_STANDARD") {
                if (eventId) {
                    await prisma.event.update({
                        where: { id: eventId },
                        data: { tier: "STANDARD" }
                    });
                }
            } else if (type === "EVENT_FEATURED") {
                if (eventId) {
                    // Featured for 30 days
                    const featuredUntil = new Date();
                    featuredUntil.setDate(featuredUntil.getDate() + 30);

                    await prisma.event.update({
                        where: { id: eventId },
                        data: {
                            tier: "FEATURED",
                            featuredUntil,
                        }
                    });
                }
            } else if (type === "ORGANIZER_SEASON") {
                // Find Organizer Profile for this user
                await prisma.organizerProfile.update({
                    where: { userId },
                    data: { verifiedStatus: "VERIFIED" } // And potentially logic for free listings
                });
            } else if (type === "VENDOR_PRO") {
                await prisma.vendor.update({
                    where: { userId },
                    data: {
                        subscriptionTier: "PRO",
                        verifiedStatus: "VERIFIED"
                    }
                });
            } else if (type === "VENDOR_BOOST") {
                if (vendorId && eventId) {
                    await prisma.vendorAppearance.upsert({
                        where: { eventId_vendorId: { eventId, vendorId } },
                        create: {
                            eventId,
                            vendorId,
                            isBoosted: true,
                        },
                        update: {
                            isBoosted: true
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Database Update Failed", error);
            return new NextResponse("Database Error", { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
