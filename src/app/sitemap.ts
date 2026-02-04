import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || "https://car-show-calendar.vercel.app";

    // 1. Static Routes
    const staticRoutes = [
        "",
        "/events",
        "/contact",
        "/about",
        "/privacy",
        "/terms",
        "/refund-policy",
        "/vendors-info", // If exists
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1.0 : 0.8,
    }));

    // 2. Dynamic Events
    const events = await prisma.event.findMany({
        where: { status: "PUBLISHED" }, // Only published events
        select: { slug: true, updatedAt: true },
    });

    const eventRoutes = events.map((event) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: event.updatedAt,
        changeFrequency: "daily" as const, // Events change often
        priority: 0.9,
    }));

    // 3. Dynamic Locations (States)
    // We can hardcode 50 states or fetch from used locations.
    // Converting distinct states from DB is better but Prisma Distinct is easy.
    const locations = await prisma.event.findMany({
        where: { status: "PUBLISHED" },
        select: { state: true },
        distinct: ["state"],
    });

    const locationRoutes = locations
        .filter((l) => l.state && l.state.length === 2) // Basic validation
        .map((l) => ({
            url: `${baseUrl}/events/location/${l.state!.toLowerCase()}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

    return [...staticRoutes, ...eventRoutes, ...locationRoutes];
}
