
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const PRICES = {
    EVENT_STANDARD: {
        amount: 2900,
        name: "Standard Event Listing",
        description: "Full details, Poster, Links, Analytics, Voting via AutoShowList.",
    },
    EVENT_FEATURED: {
        amount: 9900,
        name: "Featured Event Listing",
        description: "Standard + Homepage Feature, Top of Search, Weekly Email.",
    },
    ORGANIZER_SEASON: {
        amount: 39900,
        name: "Organizer Season Pass (Yearly)",
        description: "Unlimited Standard Listings, Badge, Archive Access.",
    },
    VENDOR_PRO: {
        amount: 9900,
        name: "Vendor Pro Subscription (Yearly)",
        description: "Verified Badge, Enhanced Profile, Priority Search.",
    },
    VENDOR_BOOST: {
        amount: 1500,
        name: "Vendor Event Boost",
        description: "Top placement on a specific Event page (14 days).",
    },
};

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { type, eventId, vendorId } = body;

        // Validate inputs
        if (!PRICES[type as keyof typeof PRICES]) {
            return new NextResponse("Invalid Product Type", { status: 400 });
        }

        const priceConfig = PRICES[type as keyof typeof PRICES];

        // Metadata construction
        const metadata: any = {
            userId: user.id,
            type,
        };
        if (eventId) metadata.eventId = eventId;
        if (vendorId) metadata.vendorId = vendorId;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "auto",
            customer_email: user.email!,
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: priceConfig.name,
                        description: priceConfig.description,
                    },
                    unit_amount: priceConfig.amount,
                },
                quantity: 1,
            }],
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
            metadata,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
