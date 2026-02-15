"use server";

import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validations/event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { geocodeAddress } from "@/lib/geocoding";
import { slugify } from "@/lib/utils";
import { format } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createEvent(data: any) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    const result = eventSchema.safeParse(data);
    if (!result.success) {
        return { error: "Validation failed", details: result.error.flatten() };
    }

    const {
        title, description, startDateTime, endDateTime, venueName,
        addressLine1, city, state, zip, rainDatePolicy, rainDate,
        entryFee, entryFeeMax, spectatorFee, spectatorFeeMax, vehicleRequirements, judgedOrCruiseIn,
        charityBeneficiary, contactEmail, contactPhone,
        websiteUrl, facebookUrl, registrationUrl, posterUrl, votingEnabled, isPreRelease
    } = result.data;

    // Ensure Organizer Profile exists
    let organizer = await prisma.organizerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!organizer) {
        // Auto-create organizer profile for first-time submitters
        organizer = await prisma.organizerProfile.create({
            data: {
                userId: session.user.id,
                organizerName: session.user.name || "Organizer",
                verifiedStatus: "UNVERIFIED"
            }
        });
    }

    // Geocode with shared utility (using structured fallback)
    const { lat, lng } = await geocodeAddress({
        street: addressLine1,
        venue: venueName,
        city,
        state,
        zip
    });

    // Generate SEO-friendly slug
    const dateStr = format(new Date(startDateTime), 'yyyy-MM-dd');
    const baseSlug = slugify(`${title}-${city}-${dateStr}`);
    let slug = baseSlug;
    let counter = 1;

    // Ensure uniqueness
    while (true) {
        const existing = await prisma.event.findUnique({
            where: { slug } // slug is @unique in schema
        });
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    try {
        const event = await prisma.event.create({
            data: {
                organizerId: organizer.id,
                slug, // Add the generated slug
                title,
                description: description || "No description provided.",
                startDateTime: new Date(startDateTime),
                endDateTime: new Date(endDateTime),
                venueName,
                addressLine1,
                city,
                state,
                zip,
                latitude: lat,
                longitude: lng,
                rainDatePolicy,
                rainDate: rainDate ? new Date(rainDate) : null,
                entryFee,
                entryFeeMax,
                spectatorFee,
                spectatorFeeMax,
                vehicleRequirements,
                judgedOrCruiseIn,
                charityBeneficiary,
                contactEmail,
                contactPhone,
                websiteUrl,
                facebookUrl,
                registrationUrl,
                posterUrl: posterUrl || "", // Allow empty string for Basic listing
                votingEnabled,
                isPreRelease,
                status: "SUBMITTED", // Default to submitted state
                tier: "FREE_BASIC"
            }
        });

        revalidatePath("/");
        revalidatePath("/dashboard");
        revalidatePath("/map");
        return { success: true, eventId: event.id };

    } catch (error) {
        console.error("Failed to create event:", error);
        return { error: "Database error" };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateEvent(data: any) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    const { id, ...formData } = data;
    if (!id) return { error: "Missing Event ID" };

    const result = eventSchema.safeParse(formData);
    if (!result.success) {
        return { error: "Validation failed", details: result.error.flatten() };
    }

    const {
        title, description, startDateTime, endDateTime, venueName,
        addressLine1, city, state, zip, rainDatePolicy, rainDate,
        entryFee, entryFeeMax, spectatorFee, spectatorFeeMax, vehicleRequirements, judgedOrCruiseIn,
        charityBeneficiary, contactEmail, contactPhone,
        websiteUrl, facebookUrl, registrationUrl, posterUrl, votingEnabled, isPreRelease
    } = result.data;

    // Check ownership
    const existingEvent = await prisma.event.findUnique({
        where: { id },
        include: { organizer: true }
    });

    if (!existingEvent) return { error: "Event not found" };

    // Check ownership logic...
    const organizerProfile = await prisma.organizerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!organizerProfile || existingEvent.organizerId !== organizerProfile.id) {
        if (session.user.role !== "ADMIN") {
            return { error: "Unauthorized: You do not own this event" };
        }
    }

    // Geocode (always re-run to ensure accuracy)
    const { lat, lng } = await geocodeAddress({
        street: addressLine1,
        venue: venueName,
        city,
        state,
        zip
    });

    try {
        await prisma.event.update({
            where: { id },
            data: {
                title,
                description: description || "No description provided.",
                startDateTime: new Date(startDateTime),
                endDateTime: new Date(endDateTime),
                venueName,
                addressLine1,
                city,
                state,
                zip,
                latitude: lat,
                longitude: lng,
                rainDatePolicy,
                rainDate: rainDate ? new Date(rainDate) : null,
                entryFee,
                entryFeeMax,
                spectatorFee,
                spectatorFeeMax,
                vehicleRequirements,
                judgedOrCruiseIn,
                charityBeneficiary,
                contactEmail,
                contactPhone,
                websiteUrl,
                facebookUrl,
                registrationUrl,
                posterUrl: posterUrl || "",
                votingEnabled,
                isPreRelease,
            }
        });

        revalidatePath(`/events/${id}`);
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/events");
        revalidatePath("/map");
        return { success: true, eventId: id };
    } catch (error) {
        console.error("Failed to update event:", error);
        return { error: "Database error" };
    }
}

export async function claimEvent(eventId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    if (!event) return { error: "Event not found" };
    if (!event.isClaimable) return { error: "This event is not available for claiming." };

    // Check Subscription Status
    const subscription = await prisma.subscription.findFirst({
        where: {
            userId: session.user.id,
            status: { in: ['active', 'trialing'] }
        }
    });

    // Allow Admins to bypass (optional, but good practice if you have roles)
    // const isAdmin = session.user.role === 'ADMIN';

    if (!subscription) {
        return { error: "Subscription Required" };
    }

    // Get/Create Organizer Profile
    let organizer = await prisma.organizerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!organizer) {
        organizer = await prisma.organizerProfile.create({
            data: {
                userId: session.user.id,
                organizerName: session.user.name || "Newly Claimed Organizer",
                verifiedStatus: "UNVERIFIED"
            }
        });
    }

    try {
        await prisma.event.update({
            where: { id: eventId },
            data: {
                organizerId: organizer.id,
                isClaimable: false,
                tier: "STANDARD", // Free Upgrade Reward
                updatedAt: new Date(),
            }
        });

        revalidatePath(`/events/${eventId}`);
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        console.error("Claim error:", e);
        return { error: "Failed to claim event." };
    }
}

export async function deleteEvents(eventIds: string[]) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.event.deleteMany({
            where: {
                id: {
                    in: eventIds
                }
            }
        });

        revalidatePath("/admin/all-events");
        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true, count: eventIds.length };
    } catch (error) {
        console.error("Failed to delete events:", error);
        return { error: "Failed to delete events" };
    }
}
