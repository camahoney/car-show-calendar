import Parser from "rss-parser";

const parser = new Parser();

export interface RssItem {
    title: string;
    link: string;
    contentSnippet: string;
    pubDate: string;
}

export async function fetchRssFeed(url: string): Promise<RssItem[]> {
    try {
        const feed = await parser.parseURL(url);
        return feed.items.map(item => ({
            title: item.title || "No Title",
            link: item.link || url,
            contentSnippet: item.contentSnippet || item.content || "",
            pubDate: item.pubDate || new Date().toISOString(),
        }));
    } catch (error) {
        console.error(`Error parsing RSS feed ${url}:`, error);
        return [];
    }
}
