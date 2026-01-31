"use server";

import { prisma } from "@/lib/prisma";
import { processScan } from "@/lib/leads/processor";
import { revalidatePath } from "next/cache";

// --- SCAN CONTROL ---

export async function runScanAction() {
    // In a real app, this should trigger a background job (Queue/Worker).
    // For Vercel serverless, this might time out if too many sources.
    // We'll run it directly but be aware of 60s timeout limits.
    // Optimized: Only process 2-3 sources at a time or limiting items if expanding.

    const result = await processScan();
    revalidatePath("/admin/leads");
    return { success: true, ...result };
}

export async function getScanHistory() {
    return await prisma.scanRun.findMany({
        orderBy: { startedAt: 'desc' },
        take: 5
    });
}

// --- LEAD MANAGEMENT ---

export async function getLeads(filter: 'ALL' | 'NEW' | 'REVIEWED' = 'NEW') {
    const whereClause = filter === 'ALL' ? {} : { status: filter };

    return await prisma.lead.findMany({
        where: whereClause,
        orderBy: { score: 'desc' },
        take: 50
    });
}

export async function updateLeadStatus(id: string, status: string) {
    await prisma.lead.update({
        where: { id },
        data: { status }
    });
    revalidatePath("/admin/leads");
}

export async function deleteLead(id: string) {
    await prisma.lead.delete({ where: { id } });
    revalidatePath("/admin/leads");
}

// --- SOURCE MANAGEMENT ---

export async function getScanSources() {
    return await prisma.scanSource.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function addScanSource(name: string, type: 'RSS' | 'URL', url: string) {
    await prisma.scanSource.create({
        data: {
            name,
            type,
            config: { url },
            enabled: true
        }
    });
    revalidatePath("/admin/leads");
}

export async function deleteScanSource(id: string) {
    await prisma.scanSource.delete({ where: { id } });
    revalidatePath("/admin/leads");
}

export async function toggleScanSource(id: string, enabled: boolean) {
    await prisma.scanSource.update({
        where: { id },
        data: { enabled }
    });
    revalidatePath("/admin/leads");
}
