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
    const isFeatured = event.tier === "FEATURED" || event.tier === "PREMIUM";
    const isFree = event.tier === "FREE_BASIC" || event.tier === "FREE";
    const eventDate = new Date(event.startDateTime);

    return (
        <Link href={`/events/${event.slug || event.id}`} className="group block h-full">
            <div className={cn(
                "relative h-full flex flex-col overflow-hidden rounded-[2rem] ultra-glass border border-white/10 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] hover:-translate-y-2",
                isFeatured ? "ring-1 ring-primary/40 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-primary/10" : "bg-card/40 backdrop-blur-xl"
            )}>
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
                    {event.posterUrl ? (
                        <Image
                            src={event.posterUrl}
                            alt={event.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-white/10" />
                        </div>
                    )}

                    {/* Gradient Overlay for Typography Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                    {/* Top ambient glow to separate image from top border */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent opacity-60 pointer-events-none" />

                    {/* Highly Frosted Date Badge */}
                    <div className="absolute top-4 left-4 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[12px] border border-white/20 rounded-2xl shadow-xl w-[3.5rem] h-[4rem]">
                        <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em] leading-none mb-1 drop-shadow-md">
                            {format(eventDate, "MMM")}
                        </span>
                        <span className="text-2xl font-black text-white leading-none tracking-tighter drop-shadow-lg">
                            {format(eventDate, "d")}
                        </span>
                    </div>

                    {/* Badges Cluster (Top Right) */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                        {isFeatured && (
                            <Badge variant="default" className="bg-primary hover:bg-primary/90 font-black tracking-wide shadow-[0_0_15px_-3px_rgba(239,68,68,0.5)] border border-red-400/30 px-3 py-1 text-xs">
                                FEATURED
                            </Badge>
                        )}

                        {event.isPreRelease && !isFeatured && (
                            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 font-bold shadow-lg shadow-yellow-500/20 border-0 text-black px-3 py-1">
                                SAVE THE DATE
                            </Badge>
                        )}

                        {!isFeatured && !event.isPreRelease && event.source === "SCRAPER" && (
                            <Badge variant="secondary" className="bg-blue-500/90 hover:bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30 border border-blue-400/30 backdrop-blur-md px-3 py-1">
                                RECOMMENDED
                            </Badge>
                        )}
                    </div>

                    {/* Expiration Countdown (Free Listings Only) */}
                    {isFree && (
                        <div className="absolute bottom-3 right-3 z-10 transition-transform duration-300 group-hover:translate-x-1">
                            <div className="scale-90 origin-bottom-right drop-shadow-xl">
                                <CountdownTimer targetDate={event.endDateTime} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow relative z-10">
                    {/* Subtle Inner Highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <h3 className="text-2xl font-extrabold tracking-tight text-white leading-[1.15] mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300 drop-shadow-sm" title={event.title}>
                        {event.title}
                    </h3>

                    {/* Meta Data Pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-auto">
                        {/* Location Pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 shadow-sm backdrop-blur-md transition-colors group-hover:bg-white/[0.05]">
                            <MapPin className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-xs font-semibold text-gray-300 truncate max-w-[140px] tracking-wide">
                                {event.city}, {event.state}
                            </span>
                        </div>
                        
                        {/* Time Pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 shadow-sm backdrop-blur-md transition-colors group-hover:bg-white/[0.05]">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-semibold text-gray-300 tracking-wide">
                                {format(eventDate, "h:mm a")}
                            </span>
                        </div>
                        
                        {/* Price Pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 shadow-sm backdrop-blur-md transition-colors group-hover:bg-white/[0.05]">
                            <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-bold text-gray-200 tracking-wide">
                                {event.entryFee && event.entryFee > 0 ? `$${event.entryFee}` : 'FREE'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
