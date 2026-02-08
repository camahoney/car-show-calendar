import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Eye, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { approveEvent, rejectEvent } from "@/app/actions/admin"; // We need to create these actions

export default async function AdminEventsPage() {
    const pendingEvents = await prisma.event.findMany({
        where: { status: "PENDING_REVIEW" },
        include: { organizer: true },
        orderBy: { createdAt: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">Event Moderation</h1>
                    <p className="text-muted-foreground">Review and approve submitted events.</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-1 border-primary/50 text-primary glow-text">
                    {pendingEvents.length} Pending
                </Badge>
            </div>

            <div className="grid gap-6">
                {pendingEvents.length === 0 && (
                    <Card className="glass border-dashed border-white/10 p-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <Check className="h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
                            <p className="text-muted-foreground">No events currently pending approval.</p>
                        </div>
                    </Card>
                )}

                {pendingEvents.map((event) => (
                    <Card key={event.id} className="glass overflow-hidden group hover:border-white/20 transition-all">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Poster Thumbnail */}
                            <div className="relative w-full md:w-64 aspect-video md:aspect-auto bg-black/50">
                                <Image
                                    src={event.posterUrl}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1 py-6 pr-6 space-y-4">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <span>By {event.organizer.organizerName}</span>
                                                <span>•</span>
                                                <span>{format(new Date(event.startDateTime), "MMM d, yyyy")}</span>
                                                <span>•</span>
                                                <span>{event.city}, {event.state}</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="outline" asChild>
                                                <Link href={`/events/${event.id}`} target="_blank">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {event.description}
                                </p>

                                <div className="flex items-center gap-4 pt-2">
                                    <form action={approveEvent}>
                                        <input type="hidden" name="eventId" value={event.id} />
                                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                            <Check className="h-4 w-4" /> Approve
                                        </Button>
                                    </form>

                                    <form action={rejectEvent}>
                                        <input type="hidden" name="eventId" value={event.id} />
                                        <Button type="submit" variant="destructive" className="gap-2">
                                            <X className="h-4 w-4" /> Reject
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
