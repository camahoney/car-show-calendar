"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { geocodeAddress } from "@/lib/geocoding";

export async function importEvents(jsonString: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user /* check admin role if needed */) {
        return { error: "Unauthorized" };
    }

    let events;
    try {
        events = JSON.parse(jsonString);
        if (!Array.isArray(events)) {
            // Handle single object case
            events = [events];
        }
    } catch (e) {
        return { error: "Invalid JSON format" };
    }

    // Get or Create a dedicated "Seed Organizer" or use the current user
    const organizer = await prisma.organizerProfile.upsert({
        where: { userId: session.user.id },
        update: {},
        create: {
            userId: session.user.id,
            organizerName: "Imported Events", // Default name if creating new
            verifiedStatus: "VERIFIED"
        }
    });

    const results = [];

    for (const e of events) {
        // Map fields
        const startDateTime = new Date(`${e.start_date}T${e.start_time || "09:00:00"}`);
        const endDateTime = new Date(`${e.end_date}T${e.end_time || "17:00:00"}`);

        // Better Address Formatting (remove empty parts)
        const addressParts = [
            e.address_street,
            e.venue_name, // Include venue name in search for better accuracy
            e.address_city,
            e.address_state,
            e.address_zip
        ].filter(p => p && p.trim().length > 0);

        const fullAddress = addressParts.join(", ");

        let { lat, lng, source } = await geocodeAddress(fullAddress);

        try {
            await prisma.event.create({
                data: {
                    organizerId: organizer.id,
                    title: e.event_name,
                    description: "Imported Event",
                    startDateTime,
                    endDateTime,
                    venueName: e.venue_name || "TBD",
                    addressLine1: e.address_street || "",
                    city: e.address_city,
                    state: e.address_state,
                    zip: e.address_zip || "00000",
                    latitude: lat,
                    longitude: lng,
                    entryFee: parseFloat(e.entry_fee) || 0,
                    spectatorFee: parseFloat(e.spectator_fee) || 0,
                    websiteUrl: e.source_url,
                    contactEmail: e.contact_email || "info@example.com",
                    contactPhone: e.contact_phone,
                    posterUrl: "/logo-wide.png",
                    status: "APPROVED",
                    isClaimable: true,
                    tier: "FREE_BASIC"
                }
            });
            results.push({ name: e.event_name, success: true, loc: `${lat},${lng} (${source})` });
        } catch (err) {
            console.error("Failed to import event:", e.event_name, err);
            results.push({ name: e.event_name, success: false, error: "DB Error" });
        }
    }

    revalidatePath("/admin/import");
    revalidatePath("/map");
    revalidatePath("/events");
    return { success: true, results };
}
