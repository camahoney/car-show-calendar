import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { approveEvent, rejectEvent } from "@/app/actions/admin";
import { MapPin, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PendingEventActions } from "./pending-event-actions"; // Client Component for buttons

export default async function PendingEventsPage() {
    const events = await prisma.event.findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { createdAt: "asc" }, // Oldest first
        include: {
            organizerProfile: true
        }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Pending Review ({events.length})</h1>

            {events.length === 0 ? (
                <div className="text-muted-foreground">No events pending review. Good job!</div>
            ) : (
                <div className="grid gap-6">
                    {events.map((event) => (
                        <Card key={event.id} className="overflow-hidden border-white/10 bg-black/40">
                            <div className="flex flex-col md:flex-row gap-6 p-6">
                                {/* Image Preview */}
                                <div className="relative w-full md:w-48 h-32 md:h-auto shrink-0 rounded-lg overflow-hidden bg-white/5">
                                    {event.posterUrl ? (
                                        <Image
                                            src={event.posterUrl}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Image</div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-xl font-bold">{event.title}</h3>
                                            <Badge variant="outline" className="border-orange-500/50 text-orange-500">Pending</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(event.startDateTime), "PPP p")}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {event.venueName}, {event.city}, {event.state}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {event.organizerProfile?.organizerName || "Unknown Organizer"}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm line-clamp-2">{event.description}</p>

                                    <div className="flex gap-4 items-center pt-2">
                                        <Link href={`/events/${event.slug}`} target="_blank" className="text-sm text-blue-400 hover:underline">
                                            Preview Public Page
                                        </Link>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col gap-2 justify-center border-l border-white/10 pl-0 md:pl-6">
                                    <PendingEventActions eventId={event.id} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
