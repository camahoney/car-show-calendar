import OpenAI from "openai";
import { z } from "zod";

// Lazy initialization to prevent build-time crashes if key is missing
const getOpenAI = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    return new OpenAI({ apiKey });
};

// Zod schema for structured output
const ExtractedLeadSchema = z.object({
    type: z.enum(["EVENT", "VENDOR", "ORGANIZER"]),
    title: z.string(),
    summary: z.string(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    eventDate: z.string().nullable().describe("ISO date string YYYY-MM-DD if applicable"),
    contactHints: z.object({
        emails: z.array(z.string()),
        phones: z.array(z.string()),
        websites: z.array(z.string()),
        socials: z.array(z.string()),
    }),
    confidence: z.number().min(0).max(100),
});

export type ExtractedLead = z.infer<typeof ExtractedLeadSchema>;

export async function extractLeadFromText(text: string, sourceUrl: string): Promise<ExtractedLead | null> {
    try {
        const openai = getOpenAI();
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost efficient
            messages: [
                {
                    role: "system",
                    content: `You are an expert lead generation AI for a car show calendar platform. 
                    Analyze the provided text (scraped from a website or feed) and extract a structured lead.
                    Target Audiences:
                    1. EVENTS: Car shows, meets, cruise-ins, races.
                    2. VENDORS: Auto detailers, parts shops, food trucks catering to car events.
                    3. ORGANIZERS: Car clubs, fairgrounds, promotional groups.
                    
                    If the text is irrelevant or too vague, return null confidence (0).
                    Extract location data (City/State) if present.
                    Extract specific contact info (Email, Phone, Instagram/Facebook URLs).
                    `
                },
                {
                    role: "user",
                    content: `Source URL: ${sourceUrl}\n\nText Content:\n${text.substring(0, 8000)}` // Limit context
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1, // Deterministic
        });

        const content = completion.choices[0].message.content;
        if (!content) return null;

        // Try direct parse, allow for loose schema matching since we are using mini
        // Ideally we would refine this with function calling in a real robust setup
        const rawJson = JSON.parse(content);
        return rawJson as ExtractedLead; // Optimistic casting for now

    } catch (error) {
        console.error("AI Extraction Error:", error);
        return null; // Fail gracefully
    }
}

// Robust fallback version (better prompt)
export async function analyzeTextWithAI(text: string, sourceUrl: string): Promise<ExtractedLead | null> {
    try {
        const openai = getOpenAI();
        const schemaDescription = JSON.stringify({
            type: "EVENT | VENDOR | ORGANIZER",
            title: "Name of the entity or event",
            summary: "Short description (max 200 chars)",
            city: "City name or null",
            state: "State abbreviation (e.g. TX) or null",
            eventDate: "YYYY-MM-DD or null",
            contactHints: {
                emails: ["string"],
                phones: ["string"],
                websites: ["string"],
                socials: ["string"]
            },
            confidence: "0-100 integer representing likelihood this is a valuable lead"
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Extract lead data in strict JSON format based on this schema: ${schemaDescription}. 
                    If the content is not a relevant car-related lead, set confidence to 0.`
                },
                {
                    role: "user",
                    content: `Source: ${sourceUrl}\n\n${text.slice(0, 10000)}`
                }
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // Validate with Zod
        const parsed = ExtractedLeadSchema.safeParse(result);
        if (parsed.success) {
            return parsed.data;
        } else {
            console.error("Zod Validation Failed:", parsed.error);
            return null;
        }

    } catch (e) {
        // Log but don't crash app
        console.error("AI Error:", e);
        return null;
    }
}
