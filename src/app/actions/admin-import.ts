"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { geocodeAddress } from "@/lib/geocoding";
import { parse } from "date-fns";

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
        // Parse function helper
        // Normalize keys
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalize = (obj: any) => {
            const get = (keys: string[]) => {
                for (const k of keys) {
                    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
                }
                return undefined;
            };
            return {
                title: get(["event_name", "title", "name", "Event Name", "Name"]),
                venue: get(["venue_name", "venue", "location", "Venue", "Location"]),
                street: get(["address_street", "address", "street", "Address", "Street"]),
                city: get(["address_city", "city", "City"]),
                state: get(["address_state", "state", "State", "Province"]),
                zip: get(["address_zip", "zip", "Zip", "Postal Code"]),
                startDate: get(["start_date", "startDate", "starts", "Date", "Event Date"]),
                startTime: get(["start_time", "startTime", "Time", "Start Time"]),
                endDate: get(["end_date", "endDate", "ends", "End Date"]),
                endTime: get(["end_time", "endTime", "End Time"]),
                entryFee: get(["entry_fee", "entryFee", "cost", "fee", "Price"]),
                spectatorFee: get(["spectator_fee", "spectatorFee"]),
                url: get(["source_url", "url", "website", "link", "Website", "URL"]),
                email: get(["contact_email", "email", "contact", "Contact Email"]),
                phone: get(["contact_phone", "phone", "Contact Phone"]),
                desc: get(["description", "desc", "details", "Description"])
            };
        };

        const d = normalize(e);

        if (!d.title) {
            results.push({ name: JSON.stringify(e).slice(0, 20) + "...", success: false, error: "Missing Title" });
            continue;
        }

        const parseDateTime = (dateStr: string | undefined, timeStr: string | undefined, defaultTime: string) => {
            if (!dateStr) return new Date(); // Fallback to now if missing
            const timePart = timeStr && timeStr.trim() ? timeStr.trim() : defaultTime;
            // 1. Try format "yyyy-MM-dd hh:mm a"
            const combined = `${dateStr} ${timePart}`;
            let parsed = parse(combined, "yyyy-MM-dd hh:mm a", new Date());

            if (isNaN(parsed.getTime())) {
                // 2. Try ISO
                parsed = new Date(`${dateStr}T${timePart}`);
            }
            if (isNaN(parsed.getTime())) {
                parsed = new Date(dateStr); // Try just date
            }
            if (isNaN(parsed.getTime())) {
                return new Date(); // Fail safe
            }
            return parsed;
        };

        const startDateTime = parseDateTime(d.startDate, d.startTime, "09:00:00");
        const endDateTime = parseDateTime(d.endDate, d.endTime, "17:00:00");

        // Pass structured data to geocoder for smart fallbacks
        let { lat, lng, source } = await geocodeAddress({
            street: d.street || "",
            venue: d.venue || "",
            city: d.city || "",
            state: d.state || "",
            zip: d.zip || ""
        });

        try {
            await prisma.event.create({
                data: {
                    organizerId: organizer.id,
                    title: d.title,
                    description: d.desc || "Imported Event",
                    startDateTime,
                    endDateTime,
                    venueName: d.venue || d.city || "TBD",
                    addressLine1: d.street || "",
                    city: d.city || "Unknown",
                    state: d.state || "MO",
                    zip: d.zip || "00000",
                    latitude: lat,
                    longitude: lng,
                    entryFee: parseFloat(d.entryFee) || 0,
                    spectatorFee: parseFloat(d.spectatorFee) || 0,
                    websiteUrl: d.url,
                    contactEmail: d.email || "info@example.com",
                    contactPhone: d.phone,
                    posterUrl: "/logo-wide.png",
                    status: "APPROVED",
                    isClaimable: true,
                    tier: "FREE_BASIC"
                }
            });
            results.push({ name: d.title, success: true, loc: `${lat},${lng} (${source})` });
        } catch (err) {
            console.error("Failed to import event:", d.title, err);
            results.push({
                name: d.title,
                success: false,
                error: err instanceof Error ? err.message : "Unknown DB Error"
            });
        }
    }

    revalidatePath("/admin/import");
    revalidatePath("/map");
    revalidatePath("/events");
    return { success: true, results };
}
