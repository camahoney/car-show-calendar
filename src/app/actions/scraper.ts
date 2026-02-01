"use server";

import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

// Initialize Firecrawl
// Requires FIRECRAWL_API_KEY in env
const apiKey = process.env.FIRECRAWL_API_KEY;

// Schemas for Actions
const SearchSchema = z.object({
    query: z.string().min(3),
});

const ExtractSchema = z.object({
    url: z.string().url(),
});

export async function searchEvents(query: string) {
    if (!apiKey) {
        return { success: false, error: "Missing FIRECRAWL_API_KEY" };
    }

    try {
        const app = new FirecrawlApp({ apiKey: apiKey });

        // Search for pages
        // We limit to 5-10 results to save credits/time for the user to review
        const searchResult = await app.search(query, {
            pageOptions: {
                fetchPageContent: false, // Save credits, just get title/link/snippet?
                // Actually, search returns snippets by default. fetchPageContent=true scrapes full text.
                // We want fetchPageContent=false for the cheap "scan".
            },
            limit: 10
        });

        if (!searchResult.success) {
            console.error("Firecrawl API Error:", searchResult.error);
            return { success: false, error: JSON.stringify(searchResult.error) || "Search failed (API Error)" };
        }

        return { success: true, data: searchResult.data };
    } catch (error: any) {
        console.error("Firecrawl Exception:", error);
        return { success: false, error: error.message || "Internal Scraper Exception" };
    }
}

export async function extractEventDetails(url: string) {
    if (!apiKey) {
        return { success: false, error: "Missing FIRECRAWL_API_KEY" };
    }

    try {
        const app = new FirecrawlApp({ apiKey: apiKey });

        // Extract structured data
        // We define a schema for the event
        const schema = {
            type: "object",
            properties: {
                title: { type: "string" },
                date: { type: "string", description: "Event date in YYYY-MM-DD format if possible, or text" },
                time: { type: "string" },
                location: { type: "string", description: "Full address including city, state, zip" },
                description: { type: "string" },
                imageUrl: { type: "string" },
                entryFee: { type: "string" },
                organizer: { type: "string" }
            },
            required: ["title", "date", "location"]
        };

        const extractResult = await app.scrapeUrl(url, {
            formats: ["extract"],
            extract: {
                schema: schema
            }
        });

        if (!extractResult.success) {
            return { success: false, error: extractResult.error };
        }

        return { success: true, data: extractResult.extract };

    } catch (error) {
        console.error("Firecrawl Extract Error:", error);
        return { success: false, error: "Internal Extraction Error" };
    }
}
