import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format, endOfWeek, startOfWeek, addDays, endOfMonth, startOfToday } from "date-fns";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { EventFilters } from "@/components/event-filters";
import { EventCard } from "@/components/event-card";

export const metadata = {
    title: "All Events | Car Show Calendar",
    description: "Browse upcoming car shows, meets, and automotive events.",
};

export const dynamic = 'force-dynamic';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EventsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const filter = typeof params.filter === 'string' ? params.filter : 'all';
    const query = typeof params.q === 'string' ? params.q : '';

    // Calculate Date Range
    const today = startOfToday();
    let dateFilter: any = {
        gte: new Date(), // Default: Future events
    };

    if (filter === 'weekend') {
        // "This Weekend" logic: Friday to Sunday
        const friday = addDays(startOfWeek(today, { weekStartsOn: 1 }), 4); // Next Friday
        const sunday = endOfWeek(today, { weekStartsOn: 1 }); // Next Sunday

        // If today is Sunday, show today
        // If today is Saturday, show today + Sunday
        // If today is Friday, show today + Sat + Sun

        // Simplified: Show from Now until End of Week (Sunday)
        // If it's Monday-Thursday, this might show mostly empty unless we look at *next* weekend?
        // Standard expectation: "This Weekend" usually means the upcoming one. 
        // Let's stick to: End of *current* week.

        dateFilter = {
            gte: new Date(),
            lte: sunday
        };
    } else if (filter === 'month') {
        dateFilter = {
            gte: new Date(),
            lte: endOfMonth(today)
        };
    }

    // Build Prisma Where Clause
    const whereClause: any = {
        status: { in: ["APPROVED", "PUBLISHED"] },
        endDateTime: dateFilter,
    };

    if (query) {
        whereClause.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { state: { contains: query, mode: 'insensitive' } },
        ];
    }

    // State Filter
    if (params.state) {
        whereClause.state = {
            equals: params.state as string,
            mode: 'insensitive'
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let events: any[] = [];
    let states: string[] = [];

    try {
        const [eventsData, statesData] = await Promise.all([
            prisma.event.findMany({
                where: whereClause,
                orderBy: [{ startDateTime: "asc" }],
                include: { organizer: true }
            }),
            prisma.event.findMany({
                where: { status: { in: ["APPROVED", "PUBLISHED"] }, endDateTime: { gte: new Date() } },
                select: { state: true },
                distinct: ['state'],
                orderBy: { state: 'asc' }
            })
        ]);

        events = eventsData;
        states = statesData.map(s => s.state).filter(Boolean) as string[];

    } catch (error) {
        console.error("[Events Page] Failed to fetch events:", error);
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            {/* Background Gradient */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

            <div className="container relative z-10 mx-auto space-y-8">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Upcoming Events</h1>
                        <p className="text-muted-foreground">Find your next automotive experience.</p>
                    </div>

                    {/* Filters Component */}
                    <EventFilters states={states} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-6 bg-card/50 rounded-2xl border border-white/5">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">No events found</h3>
                                <p className="text-muted-foreground">
                                    {query ? `No results for "${query}"` : "Try adjusting your filters or check back later."}
                                </p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="/events/new">Post a Car Show</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
