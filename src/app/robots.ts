import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || "https://car-show-calendar.vercel.app";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/dashboard/",
                "/events/new", // Don't index the wizard
                "/api/", // Don't index API
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
