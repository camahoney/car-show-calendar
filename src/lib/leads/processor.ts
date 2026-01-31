import { prisma } from "@/lib/prisma";
import { fetchRssFeed } from "./sources/rss";
import { scrapeUrlText } from "./sources/scrape";
import { analyzeTextWithAI, ExtractedLead } from "./ai";
import crypto from "crypto";

// Helper to create a stable hash for deduplication
function createDedupeHash(title: string, date: string | null | undefined, city: string | null | undefined) {
    const raw = `${title.toLowerCase().trim()}|${date || ''}|${city?.toLowerCase().trim() || ''}`;
    return crypto.createHash('md5').update(raw).digest('hex');
}

export async function processScan() {
    console.log("Starting Scan...");

    // 1. Create ScanRun record
    const scanRun = await prisma.scanRun.create({
        data: {
            startedAt: new Date(),
        }
    });

    let itemsFound = 0;
    let leadsCreated = 0;
    let sourcesScanned = 0;
    const errors: any[] = [];

    try {
        // 2. Fetch enabled sources
        const sources = await prisma.scanSource.findMany({
            where: { enabled: true }
        });

        sourcesScanned = sources.length;

        for (const source of sources) {
            try {
                let textsToAnalyze: { text: string, link: string, date?: string, baseTitle?: string }[] = [];

                const config = source.config as any; // Type assertion

                if (source.type === 'RSS') {
                    if (config.url) {
                        const items = await fetchRssFeed(config.url);
                        textsToAnalyze = items.map(item => ({
                            text: `${item.title}\n\n${item.contentSnippet}`,
                            link: item.link,
                            date: item.pubDate,
                            baseTitle: item.title
                        }));
                    }
                } else if (source.type === 'URL') {
                    if (config.url) {
                        const text = await scrapeUrlText(config.url);
                        textsToAnalyze = [{
                            text: text,
                            link: config.url,
                            baseTitle: source.name // For URL scrape, title might be generic until extracted
                        }];
                    }
                }

                itemsFound += textsToAnalyze.length;

                // 3. Process each scraped page/item with AI
                for (const item of textsToAnalyze) {
                    try {
                        const extractedLeads = await analyzeTextWithAI(item.text, item.link);

                        if (extractedLeads && extractedLeads.length > 0) {

                            for (const lead of extractedLeads) {
                                if (lead.confidence < 50) continue; // Skip low confidence inside the batch

                                // Calculate simple score
                                const score = calculateScore(lead);

                                // Hash for dedupe
                                const hash = createDedupeHash(lead.title, lead.eventDate, lead.city);

                                try {
                                    await prisma.lead.create({
                                        data: {
                                            type: lead.type,
                                            title: lead.title,
                                            summary: lead.summary,
                                            city: lead.city,
                                            state: lead.state,
                                            eventDate: lead.eventDate ? new Date(lead.eventDate) : null,
                                            sourceName: source.name,
                                            sourceUrl: item.link, // Link to the listicle/page
                                            contactHints: lead.contactHints as any,
                                            confidence: lead.confidence,
                                            score: score,
                                            dedupeHash: hash,
                                            status: "NEW"
                                        }
                                    });
                                    leadsCreated++;
                                } catch (e: any) {
                                    if (e.code === 'P2002') {
                                        console.log(`Skipping duplicate: ${lead.title}`);
                                    } else {
                                        throw e;
                                    }
                                }
                            }
                        } else {
                            // Log why it was skipped
                            console.log(`Skipped item from ${source.name}: No leads found in text.`);
                            errors.push({
                                source: source.name,
                                message: "Skipped: AI found 0 leads in content.",
                                debugLink: item.link,
                                textLength: item.text.length
                            });
                        }
                    } catch (innerError) {
                        console.error(`Error processing item from ${source.name}:`, innerError);
                        errors.push({ source: source.name, error: String(innerError) });
                    }
                }

                // Update source last run
                await prisma.scanSource.update({
                    where: { id: source.id },
                    data: { lastRunAt: new Date() }
                });

            } catch (sourceError) {
                console.error(`Error processing source ${source.name}:`, sourceError);
                errors.push({ source: source.name, error: String(sourceError) });
            }
        }

    } catch (mainError) {
        console.error("Critical Scan Error:", mainError);
        errors.push({ critical: String(mainError) });
    } finally {
        // 4. Close ScanRun
        await prisma.scanRun.update({
            where: { id: scanRun.id },
            data: {
                finishedAt: new Date(),
                itemsFound,
                leadsCreated,
                sourcesScanned,
                errors: errors.length > 0 ? JSON.parse(JSON.stringify(errors)) : undefined
            }
        });

        console.log(`Scan Complete. Sources: ${sourcesScanned}, Found: ${itemsFound}, Created: ${leadsCreated}`);
    }

    return { leadsCreated, itemsFound };
}

function calculateScore(lead: ExtractedLead): number {
    let score = lead.confidence * 0.6;

    // Future event dates are better
    if (lead.eventDate) {
        const eventDate = new Date(lead.eventDate);
        const now = new Date();
        const diffDays = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays > 0 && diffDays < 90) {
            score += 20; // Bonus for upcoming events
        }
    }

    // Contact info is valuable
    if (lead.contactHints.emails.length > 0) score += 10;
    if (lead.contactHints.phones.length > 0) score += 5;

    return Math.min(score, 100);
}
