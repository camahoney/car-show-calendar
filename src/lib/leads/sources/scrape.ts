import * as cheerio from "cheerio";

export async function scrapeUrlText(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5"
            }
        });

        if (!response.ok) {
            // If failed (403/Forbidden especially), try Firecrawl if API key exists
            if (response.status === 403 || response.status === 401) {
                if (process.env.FIRECRAWL_API_KEY) {
                    console.log(`Basic fetch failed (${response.status}), attempting Firecrawl for ${url}`);
                    return await scrapeWithFirecrawl(url);
                }
            }
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, and other non-content elements
        $('script, style, nav, footer, iframe, svg').remove();

        // extract text from body
        const text = $('body').text();

        // Clean up whitespace
        return text.replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        throw error;
    }
}

async function scrapeWithFirecrawl(url: string): Promise<string> {
    const firecrawlKey = process.env.FIRECRAWL_API_KEY;
    if (!firecrawlKey) throw new Error("Firecrawl API Key missing");

    const fcResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: url,
            formats: ["markdown"]
        })
    });

    if (!fcResponse.ok) {
        const errText = await fcResponse.text();
        throw new Error(`Firecrawl failed: ${fcResponse.status} ${errText}`);
    }

    const data = await fcResponse.json();
    return data.data?.markdown || "";
}
