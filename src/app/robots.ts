import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://autoshowlist.com";

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
