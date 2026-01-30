"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Reuse the geocoding logic (importing it would be better if exported, otherwise duplicate for now or refactor)
// Assuming we use the mock or Mapbox if available.

async function geocode(address: string) {
    // Minimal mock or Mapbox call
    // If Mapbox token is present:
    if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        try {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                return { lat, lng };
            }
        } catch (e) {
            console.error("Geocoding failed", e);
        }
    }
    // Fallback to mockish default
    return { lat: 39.7817, lng: -89.6501 };
}

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

    let count = 0;

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

    for (const e of events) {
        // Map fields
        const startDateTime = new Date(`${e.start_date}T${e.start_time || "09:00:00"}`);
        const endDateTime = new Date(`${e.end_date}T${e.end_time || "17:00:00"}`);

        const fullAddress = `${e.address_street || ""}, ${e.address_city}, ${e.address_state} ${e.address_zip || ""}`.trim();
        const { lat, lng } = await geocode(fullAddress);

        try {
            await prisma.event.create({
                data: {
                    organizerId: organizer.id,
                    title: e.event_name,
                    description: "Imported Event", // Default description or enhance later
                    startDateTime,
                    endDateTime,
                    venueName: e.venue_name || "TBD",
                    addressLine1: e.address_street || "TBD",
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
                    posterUrl: "/logo-wide.png", // Default placeholder
                    status: "APPROVED",
                    isClaimable: true, // Key requirement
                    tier: "FREE_BASIC"
                }
            });
            count++;
        } catch (err) {
            console.error("Failed to import event:", e.event_name, err);
        }
    }

    revalidatePath("/admin/import");
    return { success: true, count };
}
