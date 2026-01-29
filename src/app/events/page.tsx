import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export const metadata = {
    title: "All Events | Car Show Calendar",
    description: "Browse upcoming car shows, meets, and automotive events.",
};

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        where: {
            status: "APPROVED",
            startDateTime: {
                gte: new Date(),
            },
        },
        orderBy: [
            { tier: "desc" }, // Featured first
            { startDateTime: "asc" },
        ],
        include: {
            organizer: true
        }
    });

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            {/* Background Gradient */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

            <div className="container relative z-10 mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Upcoming Events</h1>
                        <p className="text-muted-foreground">Find your next automotive experience.</p>
                    </div>
                    <div className="w-full md:w-auto flex gap-2">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search events..." className="pl-9 glass border-white/10" />
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 font-bold">Search</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <Link href={`/events/${event.id}`} key={event.id} className="group block h-full">
                                <div className="relative h-full overflow-hidden rounded-2xl bg-card border border-white/5 shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                                    {/* Image Section */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                        <Image
                                            src={event.posterUrl}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                        <div className="absolute top-3 left-3">
                                            <div className="glass px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 backdrop-blur-md">
                                                {format(new Date(event.startDateTime), "MMM d")}
                                            </div>
                                        </div>
                                        {event.tier === 'FEATURED' && (
                                            <div className="absolute top-3 right-3">
                                                <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-primary/20">
                                                    Featured
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute bottom-3 left-3 right-3 text-white">
                                            <p className="text-xs font-medium text-white/80 mb-0.5 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {event.city}, {event.state}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 flex flex-col gap-3">
                                        <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 text-sm text-muted-foreground">
                                            <span>{format(new Date(event.startDateTime), "EEE, h:mm a")}</span>
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <p className="text-xl text-muted-foreground">No upcoming events found.</p>
                            <Button asChild variant="outline">
                                <Link href="/events/new">Post the First Event</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
