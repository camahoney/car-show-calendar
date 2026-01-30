import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { CountdownTimer } from "./countdown-timer";

interface EventCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any;
}

export function EventCard({ event }: EventCardProps) {
    const isFeatured = event.tier === "FEATURED";
    const isFree = event.tier === "FREE_BASIC" || event.tier === "FREE"; // Check both just in case
    const eventDate = new Date(event.startDateTime);

    return (
        <Link href={`/events/${event.id}`} className="group block h-full">
            <div className={cn(
                "relative h-full overflow-hidden rounded-2xl bg-card border border-white/5 shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
                isFeatured ? "ring-1 ring-primary/40 shadow-primary/10" : ""
            )}>
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                        src={event.posterUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Floating Date Badge */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white rounded-lg px-3 py-1.5 text-center border border-white/10 shadow-lg">
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{format(eventDate, "MMM")}</div>
                        <div className="text-xl font-bold leading-none text-white">{format(eventDate, "d")}</div>
                    </div>

                    {/* Featured Badge */}
                    {isFeatured && (
                        <div className="absolute top-3 right-3">
                            <Badge variant="default" className="bg-primary hover:bg-primary font-bold shadow-lg shadow-primary/20 border-0">
                                Featured
                            </Badge>
                        </div>
                    )}

                    {/* Pre-Release Badge */}
                    {event.isPreRelease && !isFeatured && (
                        <div className="absolute top-3 right-3">
                            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 font-bold shadow-lg shadow-yellow-500/20 border-0 text-black">
                                Save The Date
                            </Badge>
                        </div>
                    )}

                    {/* Expiration Countdown (Free Listings Only) */}
                    {isFree && (
                        <div className="absolute bottom-3 right-3 z-10">
                            <CountdownTimer targetDate={event.endDateTime} />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col gap-3">
                    <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                        <MapPin className="w-4 h-4 text-primary/80" />
                        <span className="truncate">{event.city}, {event.state}</span>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between text-sm border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{format(eventDate, "h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-white">
                            <Ticket className="w-4 h-4 text-primary" />
                            {event.entryFee > 0 ? `$${event.entryFee}` : 'Free'}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
