import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Ticket, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Past Events Archive | Car Show Calendar",
    description: "Browse past car shows, meets, and automotive events organized by year.",
    robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PastEventsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = typeof params.q === "string" ? params.q : "";
    const stateFilter = typeof params.state === "string" ? params.state : "";
    const typeFilter = typeof params.type === "string" ? params.type : "";
    const yearFilter = typeof params.year === "string" ? params.year : "";

    // Build where clause — require BOTH startDateTime and endDateTime in the past
    // to guard against events with bad endDateTime data
    const now = new Date();
    const whereClause: any = {
        startDateTime: { lt: now },
        endDateTime: { lt: now },
        status: { in: ["EXPIRED", "APPROVED", "PUBLISHED", "SUBMITTED"] },
    };

    if (query) {
        whereClause.OR = [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { state: { contains: query, mode: "insensitive" } },
        ];
    }

    if (stateFilter) {
        whereClause.state = { equals: stateFilter, mode: "insensitive" };
    }

    if (typeFilter && typeFilter !== "all") {
        whereClause.judgedOrCruiseIn = typeFilter;
    }

    if (yearFilter) {
        const year = parseInt(yearFilter);
        if (!isNaN(year)) {
            whereClause.startDateTime = {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${year + 1}-01-01`),
            };
        }
    }

    const [events, statesData, yearsData] = await Promise.all([
        prisma.event.findMany({
            where: whereClause,
            orderBy: { startDateTime: "desc" },
            take: 100,
        }),
        prisma.event.findMany({
            where: { startDateTime: { lt: now }, endDateTime: { lt: now } },
            select: { state: true },
            distinct: ["state"],
            orderBy: { state: "asc" },
        }),
        prisma.$queryRaw<{ year: number }[]>`
            SELECT DISTINCT EXTRACT(YEAR FROM "startDateTime")::int as year 
            FROM "Event" 
            WHERE "startDateTime" < NOW() AND "endDateTime" < NOW() 
            ORDER BY year DESC
        `,
    ]);

    const states = statesData.map((s) => s.state).filter(Boolean) as string[];
    const years = yearsData.map((y) => y.year);

    // Group events by year
    const eventsByYear: Record<number, typeof events> = {};
    events.forEach((event) => {
        const year = new Date(event.startDateTime).getFullYear();
        if (!eventsByYear[year]) eventsByYear[year] = [];
        eventsByYear[year].push(event);
    });

    const sortedYears = Object.keys(eventsByYear)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

            <div className="container relative z-10 mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Link
                        href="/events"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Upcoming Events
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                            Past Events
                        </h1>
                        <p className="text-muted-foreground">
                            Browse past car shows and automotive events.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 glass p-4 rounded-2xl">
                    {/* Search */}
                    <form method="GET" action="/events/past" className="flex gap-2 flex-1">
                        {/* Preserve existing filters */}
                        {stateFilter && <input type="hidden" name="state" value={stateFilter} />}
                        {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
                        {yearFilter && <input type="hidden" name="year" value={yearFilter} />}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                name="q"
                                placeholder="Search past events..."
                                defaultValue={query}
                                className="w-full pl-9 pr-4 py-2 bg-transparent border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 font-bold">
                            Search
                        </Button>
                    </form>

                    {/* Year Filter */}
                    <div className="flex flex-wrap gap-2">
                        <Link href={buildFilterUrl("", stateFilter, typeFilter, query)}>
                            <Button
                                variant={!yearFilter ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "rounded-full border-white/10",
                                    !yearFilter
                                        ? "bg-white text-black hover:bg-white/90"
                                        : "bg-transparent text-muted-foreground hover:text-white"
                                )}
                            >
                                All Years
                            </Button>
                        </Link>
                        {years.map((year) => (
                            <Link key={year} href={buildFilterUrl(String(year), stateFilter, typeFilter, query)}>
                                <Button
                                    variant={yearFilter === String(year) ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "rounded-full border-white/10",
                                        yearFilter === String(year)
                                            ? "bg-white text-black hover:bg-white/90"
                                            : "bg-transparent text-muted-foreground hover:text-white"
                                    )}
                                >
                                    {year}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {events.length === 0 ? (
                    <div className="col-span-full py-20 text-center space-y-6 bg-card/50 rounded-2xl border border-white/5">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">No past events found</h3>
                            <p className="text-muted-foreground">
                                {query ? `No results for "${query}"` : "Try adjusting your filters."}
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/events">Browse Upcoming Events</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {sortedYears.map((year) => (
                            <div key={year}>
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-white">{year} Events</h2>
                                    <div className="flex-1 border-t border-white/10" />
                                    <span className="text-sm text-muted-foreground">
                                        {eventsByYear[year].length} event{eventsByYear[year].length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {eventsByYear[year].map((event) => (
                                        <PastEventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function buildFilterUrl(year: string, state: string, type: string, q: string) {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    if (state) params.set("state", state);
    if (type && type !== "all") params.set("type", type);
    if (q) params.set("q", q);
    const qs = params.toString();
    return `/events/past${qs ? `?${qs}` : ""}`;
}

function PastEventCard({ event }: { event: any }) {
    const eventDate = new Date(event.startDateTime);

    return (
        <Link href={`/events/${event.slug || event.id}`} className="group block h-full">
            <div className="relative h-full overflow-hidden rounded-2xl bg-card border border-white/5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 opacity-85 hover:opacity-100">
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                        src={event.posterUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70" />

                    {/* Date Badge */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white rounded-lg px-3 py-1.5 text-center border border-white/10">
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
                            {format(eventDate, "MMM")}
                        </div>
                        <div className="text-xl font-bold leading-none text-white">
                            {format(eventDate, "d")}
                        </div>
                    </div>

                    {/* Past Badge */}
                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-gray-700/90 text-gray-200 border-0 text-xs">
                            Past Event
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3">
                    <h3 className="text-xl font-bold leading-normal break-words line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                        <MapPin className="w-4 h-4 text-primary/80" />
                        <span className="truncate">{event.city}, {event.state}</span>
                    </div>
                    <div className="mt-auto pt-3 flex items-center justify-between text-sm border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{format(eventDate, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-white">
                            <Ticket className="w-4 h-4 text-primary" />
                            {event.entryFee > 0 ? `$${event.entryFee}` : "Free"}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
