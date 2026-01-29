import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://car-show-calendar.vercel.app'

    // 1. Static Routes
    const routes = [
        '',
        '/events',
        '/vendors',
        '/map',
        '/auth/signin',
        '/vendors/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // 2. Dynamic Events
    const events = await prisma.event.findMany({
        where: { status: 'APPROVED' },
        select: { id: true, updatedAt: true },
    })

    const eventUrls = events.map((event) => ({
        url: `${baseUrl}/events/${event.id}`,
        lastModified: event.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // 3. Dynamic Vendors
    const vendors = await prisma.vendor.findMany({
        where: { verifiedStatus: 'VERIFIED' },
        select: { slug: true, updatedAt: true },
    })

    const vendorUrls = vendors.map((vendor) => ({
        url: `${baseUrl}/vendors/${vendor.slug}`,
        lastModified: vendor.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...eventUrls, ...vendorUrls]
}
