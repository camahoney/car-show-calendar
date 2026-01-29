"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function verifyAdmin() {
    const user = await getCurrentUser();
    // Force cast to ensure we can check role property even if type inference fails
    const userWithRole = user as { id: string; role: string; email?: string | null };

    if (!userWithRole || userWithRole.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return userWithRole;
}

export async function approveEvent(formData: FormData) {
    await verifyAdmin();
    const eventId = formData.get("eventId") as string;

    await prisma.event.update({
        where: { id: eventId },
        data: { status: "APPROVED" }
    });

    revalidatePath("/admin/events");
}

export async function rejectEvent(formData: FormData) {
    await verifyAdmin();
    const eventId = formData.get("eventId") as string;

    await prisma.event.update({
        where: { id: eventId },
        data: { status: "REJECTED" }
    });

    revalidatePath("/admin/events");
}

export async function verifyOrganizer(formData: FormData) {
    await verifyAdmin();
    const organizerId = formData.get("organizerId") as string;

    await prisma.organizerProfile.update({
        where: { id: organizerId },
        data: { verifiedStatus: "VERIFIED" }
    });

    revalidatePath("/admin/verifications");
}

export async function verifyVendor(formData: FormData) {
    await verifyAdmin();
    const vendorId = formData.get("vendorId") as string;

    await prisma.vendor.update({
        where: { id: vendorId },
        data: { verifiedStatus: "VERIFIED" }
    });

    revalidatePath("/admin/verifications");
}

export async function resolveReport(formData: FormData) {
    await verifyAdmin();
    const reportId = formData.get("reportId") as string;

    await prisma.report.update({
        where: { id: reportId },
        data: { status: "RESOLVED" }
    });

    revalidatePath("/admin/reports");
}
