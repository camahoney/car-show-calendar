import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || "https://carshowcalendar.vercel.app"; // Fallback URL

    const events = await prisma.event.findMany({
        where: {
            AND: [
                { status: "PUBLISHED" },
                { slug: { not: null } },
            ]
        },
        select: { slug: true, updatedAt: true },
    });

    // Filter out any potential null slugs (though the query safeguards this) and map
    const eventRoutes = events
        .filter(event => event.slug)
        .map((event) => ({
            url: `${baseUrl}/events/${event.slug}`,
            lastModified: event.updatedAt,
            changeFrequency: "daily" as const,
            priority: 0.9,
        }));

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

    // 3. Dynamic Locations (States)
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
