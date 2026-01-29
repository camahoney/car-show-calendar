
import { prisma } from "@/lib/prisma";
import { EventExplorer } from "@/components/home/event-explorer";
import { Metadata } from "next";

interface LocationPageProps {
    params: Promise<{
        state: string;
        city: string;
    }>;
}

function normalizeLocation(term: string) {
    return term.replace(/-/g, " ").toLowerCase();
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
    const { state, city } = await params;
    const cityNormal = normalizeLocation(city);
    const stateNormal = normalizeLocation(state);

    // Capitalize for title
    const cityTitle = cityNormal.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const stateTitle = stateNormal.toUpperCase(); // States usually 2 chars, or capitalize if full name

    return {
        title: `Car Shows in ${cityTitle}, ${stateTitle} - AutoShowList`,
        description: `Find the best car shows, meets, and automotive events in ${cityTitle}, ${stateTitle}. Discover local car culture near you.`,
    }
}

export default async function LocationPage({ params }: LocationPageProps) {
    const { state, city } = await params;
    const cityDecoded = decodeURIComponent(normalizeLocation(city));
    const stateDecoded = decodeURIComponent(normalizeLocation(state));

    // Fetch events for this location
    // Note: This relies on exact string matching or case-insensitive logic depending on DB collation.
    // For Postgres/Prisma, we often need 'mode: insensitive'
    const events = await prisma.event.findMany({
        where: {
            status: { in: ["APPROVED", "SUBMITTED"] },
            city: {
                equals: cityDecoded,
                mode: 'insensitive' // Requires Prisma Client 5.0+ and Postgres
            },
            state: {
                equals: stateDecoded,
                mode: 'insensitive'
            }
        },
        orderBy: [{ tier: 'desc' }, { startDateTime: 'asc' }],
        include: { organizer: true }
    });

    // Format title
    const cityDisplay = cityDecoded.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const stateDisplay = stateDecoded.toUpperCase();

    return (
        <div className="min-h-screen bg-background pt-24">
            <div className="container mx-auto px-4 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">
                    Car Shows in <span className="text-primary">{cityDisplay}, {stateDisplay}</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Found {events.length} upcoming events in your area.
                </p>
            </div>

            <div className="container mx-auto px-4">
                {/* Pass empty array if no events, EventExplorer handles it */}
                <EventExplorer initialEvents={events as any[]} />
            </div>
        </div>
    );
}
