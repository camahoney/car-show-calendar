import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || "https://autoshowlist.com";

    let eventRoutes: any[] = [];
    let locationRoutes: any[] = [];

    try {
        // Safe DB Call for Events
        const events = await prisma.event.findMany({
            where: {
                AND: [
                    { status: "PUBLISHED" },
                    { slug: { not: null } },
                ]
            },
            select: { slug: true, updatedAt: true },
        });

        eventRoutes = events
            .filter((event: any) => event.slug)
            .map((event: any) => ({
                url: `${baseUrl}/events/${event.slug}`,
                lastModified: event.updatedAt,
                changeFrequency: "daily" as const,
                priority: 0.9,
            }));

        // Safe DB Call for Locations
        const locations = await prisma.event.findMany({
            where: { status: "PUBLISHED" },
            select: { state: true },
            distinct: ["state"],
        });

        locationRoutes = locations
            .filter((l: any) => l.state && l.state.length === 2)
            .map((l: any) => ({
                url: `${baseUrl}/events/location/${l.state!.toLowerCase()}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));

    } catch (error) {
        console.error("Sitemap generation failed (DB connection):", error);
        // Continue with empty lists to prevent build failure
    }

    const staticRoutes = [
        "",
        "/events",
        "/contact",
        "/about",
        "/privacy",
        "/terms",
        "/refund-policy",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1.0 : 0.8,
    }));

    return [...staticRoutes, ...eventRoutes, ...locationRoutes];
}
