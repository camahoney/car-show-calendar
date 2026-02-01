
import FirecrawlApp from "@mendable/firecrawl-js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.FIRECRAWL_API_KEY;

console.log("Testing Firecrawl Key...");
console.log("Key present:", !!apiKey);
if (apiKey) console.log("Key starts with:", apiKey.substring(0, 5));

async function test() {
    if (!apiKey) {
        console.error("No API Key found in .env");
        return;
    }

    try {
        const app = new FirecrawlApp({ apiKey: apiKey });
        console.log("Searching for 'Test Source'...");

        const result = await app.search("Car shows in St Louis", {
            limit: 1
        });

        if (result.success) {
            console.log("Success!");
            console.log("Data:", result.data);
        } else {
            console.error("API Error Result:", result);
            // @ts-ignore
            if (result.error) console.error("Error Detail:", result.error);
        }

        // Test Extraction
        console.log("\nTesting Extraction (v2 method) on firecrawl.dev...");

        // formats: ['extract'] is deprecated/removed in v2 scrape.
        // Use app.extract({ urls: [...], schema: ... })
        // @ts-ignore
        const extractResult = await app.extract({
            urls: ["https://firecrawl.dev"],
            schema: {
                type: "object",
                properties: { title: { type: "string" } }
            }
        });

        console.log("Extract Result Keys:", Object.keys(extractResult));
        console.log("Extract Result Success?", extractResult.success);
        console.log("Extract Result Data:", extractResult.extract || extractResult.data);

    } catch (e) {
        console.error("Exception:", e);
    }
}

test();
