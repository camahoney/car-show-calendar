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

    // Calculate Date Range — filter on startDateTime so events leave the feed
    // the day after their start date
    const today = startOfToday();
    let dateFilter: any = {
        gte: today, // Default: events starting today or later
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
            gte: today,
            lte: sunday
        };
    } else if (filter === 'month') {
        dateFilter = {
            gte: today,
            lte: endOfMonth(today)
        };
    }

    // Build Prisma Where Clause
    const whereClause: any = {
        status: { in: ["APPROVED", "PUBLISHED", "SUBMITTED"] },
        startDateTime: dateFilter,
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

    // Event Type Filter (judgedOrCruiseIn)
    if (params.type && params.type !== 'all') {
        whereClause.judgedOrCruiseIn = params.type as string;
    }

    // Price Range Filter (entryFee)
    if (params.price) {
        switch (params.price) {
            case 'free':
                whereClause.OR = [
                    ...(whereClause.OR || []),
                    { entryFee: null },
                    { entryFee: 0 },
                ];
                // If we already have OR from search, we need AND logic
                if (query) {
                    // Wrap search OR into AND with price filter
                    const searchOR = whereClause.OR.filter((c: any) => !('entryFee' in c));
                    const priceOR = whereClause.OR.filter((c: any) => 'entryFee' in c);
                    whereClause.AND = [
                        { OR: searchOR },
                        { OR: priceOR },
                    ];
                    delete whereClause.OR;
                }
                break;
            case 'under20':
                whereClause.entryFee = { lte: 20 };
                break;
            case 'under50':
                whereClause.entryFee = { lte: 50 };
                break;
        }
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
                where: { status: { in: ["APPROVED", "PUBLISHED", "SUBMITTED"] }, startDateTime: { gte: today } },
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
            {/* Advanced Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="hero-mesh-1 opacity-30 mix-blend-screen" />
                <div className="hero-mesh-2 opacity-20 mix-blend-screen animate-float" />
                <div className="absolute inset-0 bg-[#020817] z-0 opacity-40 mix-blend-multiply" />
            </div>

            <div className="container relative z-10 mx-auto space-y-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Upcoming Events</h1>
                            <p className="text-muted-foreground">Find your next automotive experience.</p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Link href="/events/past">Browse Past Events →</Link>
                        </Button>
                    </div>

                    {/* Filters Component */}
                    <EventFilters states={states} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.length > 0 ? (
                        events.map((event, i) => (
                            <div key={event.id} className={`animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both`} style={{ animationDelay: `${i * 100}ms` }}>
                                <EventCard event={event} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-6 ultra-glass rounded-3xl mx-auto max-w-2xl mt-12 animate-in fade-in zoom-in duration-500 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                            <div className="space-y-3">
                                <h3 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">No events found</h3>
                                <p className="text-muted-foreground text-lg">
                                    {query ? `No results for "${query}"` : "Try adjusting your filters or check back later."}
                                </p>
                            </div>
                            <Button asChild className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-lg animate-pulse-glow hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.8)] font-bold text-lg px-8 py-6 rounded-full mt-4">
                                <Link href="/events/new">Post a Car Show</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
