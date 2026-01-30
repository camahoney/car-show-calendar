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
    // 1. Try Mapbox if token exists
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
            console.error("Mapbox Geocoding failed", e);
        }
    }

    // 2. Fallback to OpenStreetMap (Nominatim) - Free, no key required
    try {
        // User-Agent is required by Nominatim TOS
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "CarShowCalendar/1.0"
            }
        });
        const data = await res.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
    } catch (e) {
        console.error("Nominatim Geocoding failed", e);
    }

    // 3. Final Fallback (Springfield, IL)
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

        let geoSource = "Fallback";
        let lat = 39.7817;
        let lng = -89.6501;

        // Geocoding Logic
        if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
            try {
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`;
                const res = await fetch(url);
                const data = await res.json();
                if (data.features && data.features.length > 0) {
                    [lng, lat] = data.features[0].center;
                    geoSource = "Mapbox";
                }
            } catch (err) { console.error("Mapbox failed", err); }
        }

        if (geoSource === "Fallback") {
            try {
                // Nominatim Search
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;
                const res = await fetch(url, { headers: { "User-Agent": "CarShowCalendar/1.0" } });
                const data = await res.json();
                if (data && data.length > 0) {
                    lat = parseFloat(data[0].lat);
                    lng = parseFloat(data[0].lon);
                    geoSource = "Nominatim";
                }
            } catch (err) { console.error("Nominatim failed", err); }
        }

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
            results.push({ name: e.event_name, success: true, loc: `${lat},${lng} (${geoSource})` });
        } catch (err) {
            console.error("Failed to import event:", e.event_name, err);
            results.push({ name: e.event_name, success: false, error: "DB Error" });
        }
    }

    revalidatePath("/admin/import");
    return { success: true, results };
}
