import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://car-show-calendar.vercel.app'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
