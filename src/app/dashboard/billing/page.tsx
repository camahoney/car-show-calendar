import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BillingClient } from "./client-page";
import { redirect } from "next/navigation";

export default async function BillingPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/signin");
    }

    const organizer = await prisma.organizerProfile.findUnique({
        where: { userId: user.id }
    });

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    return (
        <BillingClient
            isVerifiedOrganizer={organizer?.verifiedStatus === "VERIFIED"}
            isProVendor={vendor?.subscriptionTier === "PRO"}
        />
    );
}
