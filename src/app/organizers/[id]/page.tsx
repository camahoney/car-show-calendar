import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle2, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const organizer = await prisma.organizerProfile.findUnique({
        where: { id },
    });

    if (!organizer) return { title: "Organizer Not Found" };

    return {
        title: `${organizer.organizerName} | Car Show Calendar`,
        description: `View upcoming car shows and events by ${organizer.organizerName}.`,
    };
}

export default async function OrganizerPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch Organizer and their Events
    const organizer = await prisma.organizerProfile.findUnique({
        where: { id },
        include: {
            events: {
                where: {
                    status: { in: ["APPROVED", "PUBLISHED"] },
                    endDateTime: { gte: new Date() } // Upcoming only
                },
                orderBy: { startDateTime: "asc" },
                include: { organizer: true } // Needed for EventCard
            }
        }
    });

    if (!organizer) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            {/* Background Gradient */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background z-0" />

            <div className="container relative z-10 mx-auto max-w-6xl space-y-12">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-white/5 pb-12">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white/5 bg-muted shrink-0">
                        {/* Placeholder Avatar - could generate one with initials if no image */}
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20 text-4xl font-bold text-primary">
                            {organizer.organizerName.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4 flex-1">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-4xl font-extrabold tracking-tight text-white">{organizer.organizerName}</h1>
                                {organizer.verifiedStatus === 'VERIFIED' && (
                                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Organizer
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-lg">
                                Member since {new Date(organizer.createdAt).getFullYear()} • {organizer.events.length} Upcoming Events
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            {organizer.website && (
                                <Link href={organizer.website} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Globe className="w-4 h-4" /> Website
                                    </Button>
                                </Link>
                            )}
                            <Button size="sm" className="gap-2" disabled>
                                <Calendar className="w-4 h-4" /> Subscribe (Coming Soon)
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Upcoming Events <Badge variant="outline" className="ml-2">{organizer.events.length}</Badge>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {organizer.events.length > 0 ? (
                            organizer.events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center bg-card/50 rounded-xl border border-white/5">
                                <p className="text-muted-foreground">No upcoming events scheduled.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
