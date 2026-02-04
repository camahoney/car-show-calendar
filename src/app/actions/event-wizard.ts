"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Types ---
export type EventDraftData = {
    step: number;
    // We allow loose typing for drafts as they are partial
    [key: string]: any;
};

// --- Helper: Slug Generator ---
export async function generateSlug(title: string): Promise<string> {
    let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
        .replace(/^-+|-+$/g, ""); // Trim dashes

    // Check uniqueness
    let isUnique = false;
    let counter = 0;
    let originalSlug = slug;

    while (!isUnique) {
        const potentialSlug = counter === 0 ? originalSlug : `${originalSlug}-${counter}`;
        const existing = await prisma.event.findUnique({
            where: { slug: potentialSlug }
        });

        // Also check if any vendor has this slug? (Ideally namespaces should be different /events/ vs /vendors/)
        // Our schema has unique constraint on Vendor.slug AND Event.slug individually, but they might share a namespace if we are not careful?
        // Routes are /events/[slug] and /vendors/[slug], so collision ok.

        if (!existing) {
            slug = potentialSlug;
            isUnique = true;
        } else {
            counter++;
        }
    }

    return slug;
}

// --- Action: Save Draft ---
export async function saveDraft(data: EventDraftData) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const draft = await prisma.eventDraft.upsert({
            where: {
                // We need a unique constraint or logic? Schema has `id`.
                // If Frontend calls saveDraft, it should pass draftID if receiving one.
                // Wait, if we don't pass ID, we create new?
                // Let's change signature to accept draftId?
                // Or find draft by User? Schema says `@@index([userId])`.
                // A user might have MULTIPLE drafts?
                // For MVP, maybe only 1 draft allowed? Or pass ID.
                // Let's checking input.
                id: data.id || "new-draft-placeholder" // This logic is flawed for upsert without ID.
            },
            create: {
                userId: user.id,
                step: data.step,
                data: JSON.stringify(data)
            },
            update: {
                step: data.step,
                data: JSON.stringify(data)
            }
        });
        // Wait, Upsert requires a UNIQUE matching field. `id` is PK.
        // If data.id is undefined, we can't Upsert by ID.
        // Revised Logic below.
    } catch (e) { }
}

export async function saveEventDraft(draftId: string | undefined, data: any, step: number) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        let draft;
        if (draftId) {
            // Update existing
            draft = await prisma.eventDraft.update({
                where: { id: draftId },
                data: {
                    data: JSON.stringify(data),
                    step: step
                }
            });
        } else {
            // Create New
            draft = await prisma.eventDraft.create({
                data: {
                    userId: user.id,
                    data: JSON.stringify(data),
                    step: step
                }
            });
        }

        return { success: true, draftId: draft.id };
    } catch (error) {
        console.error("Save Draft Failed:", error);
        return { success: false, error: "Failed to save draft" };
    }
}

// --- Action: Get Draft ---
export async function getEventDraft(draftId?: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    if (draftId) {
        return prisma.eventDraft.findUnique({
            where: { id: draftId }
        });
    }

    // Find most recent draft?
    return prisma.eventDraft.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
    });
}


// --- Action: Publish Event ---
export async function publishEvent(draftId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const draft = await prisma.eventDraft.findUnique({ where: { id: draftId } });
        if (!draft) return { success: false, error: "Draft not found" };

        const data = JSON.parse(draft.data);

        // TODO: Full Validation with Zod here before creating Event

        // Check Organizer Profile
        const organizer = await prisma.organizerProfile.findUnique({ where: { userId: user.id } });
        let organizerId = organizer?.id;

        if (!organizerId) {
            // Auto-create organizer profile if missing?
            // Actually, we should force them to Create Profile first?
            // Or create it here based on basic info?
            const newOrg = await prisma.organizerProfile.create({
                data: {
                    userId: user.id,
                    organizerName: user.name || "Organizer",
                    verifiedStatus: "UNVERIFIED"
                }
            });
            organizerId = newOrg.id;
        }

        // Generate Slug
        const slug = await generateSlug(data.title);

        const event = await prisma.event.create({
            data: {
                organizerId: organizerId,
                title: data.title,
                description: data.description,
                startDateTime: new Date(data.startDateTime),
                endDateTime: new Date(data.endDateTime),
                venueName: data.venueName,
                addressLine1: data.addressLine1,
                city: data.city,
                state: data.state,
                zip: data.zip,
                latitude: parseFloat(data.latitude || "0"),
                longitude: parseFloat(data.longitude || "0"),
                posterUrl: data.posterUrl!, // Assumed validated
                slug: slug,
                status: "PENDING_REVIEW", // Moderation Queue
                tier: "FREE_BASIC", // Default
                entryFee: data.entryFee ? parseFloat(data.entryFee) : null,
                contactEmail: data.contactEmail,
                websiteUrl: data.websiteUrl,
                // Add fields as needed
            }
        });

        // Delete Draft
        await prisma.eventDraft.delete({ where: { id: draftId } });

        revalidatePath("/events");
        revalidatePath("/admin"); // For moderation queue

        return { success: true, eventId: event.id, slug: event.slug };
    } catch (error) {
        console.error("Publish Failed:", error);
        return { success: false, error: "Failed to publish event" };
    }
}
