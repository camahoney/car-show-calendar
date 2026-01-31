
import {
    getLeads,
    getScanSources,
} from "@/app/actions/leads";
import LeadFinderClient from "./client-page";

// Server Component (Async)
export default async function LeadFinderPage() {
    // Fetch initial data on the server
    const leads = await getLeads('NEW');
    const sources = await getScanSources();

    // Pass data to Client Component
    // Casting raw Prisma objects if needed, assuming they match the type mostly
    // or we might need JSON.parse(JSON.stringify(data)) if there are date objects, 
    // but Server Components -> Client Components usually handle Dates fine in recent Next.js
    return (
        <LeadFinderClient
            initialLeads={leads as any}
            initialSources={sources as any}
        />
    );
}

export const dynamic = 'force-dynamic'; // Ensure it runs on request
