import * as cheerio from "cheerio";

export async function scrapeUrlText(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, and other non-content elements
        $('script, style, nav, footer, iframe, svg').remove();

        // extract text from body
        // We want to preserve some structure hopefully, but raw text is usually okay for LLM
        const text = $('body').text();

        // Clean up whitespace
        return text.replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        throw error;
    }
}
