import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { getStateBySlug } from "@/lib/us-states";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const state = getStateBySlug(slug);

    if (!state) return { title: "Location Not Found" };

    return {
        title: `Car Shows in ${state.name} | Car Show Calendar`,
        description: `Find upcoming car shows, meets, and automotive events in ${state.name}. The best local car calendar for ${new Date().getFullYear()}.`,
        openGraph: {
            title: `Car Shows in ${state.name} | Car Show Calendar`,
            description: `Discover the best car events in ${state.name}.`,
        }
    };
}

export default async function LocationPage({ params }: PageProps) {
    const { slug } = await params;
    const state = getStateBySlug(slug);

    if (!state) {
        notFound();
    }

    const events = await prisma.event.findMany({
        where: {
            status: { in: ["APPROVED", "PUBLISHED"] },
            state: state.code,
            endDateTime: {
                gte: new Date(),
            },
        },
        orderBy: [
            { tier: "desc" },
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
                {/* Header */}
                <div className="space-y-4">
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" asChild>
                        <Link href="/events">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Events
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                            Car Shows in <span className="text-primary">{state.name}</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Found {events.length} upcoming {events.length === 1 ? 'event' : 'events'} in {state.name}.
                        </p>
                    </div>
                </div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-6 bg-card/50 rounded-2xl border border-white/5">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">No active events in {state.name}</h3>
                                <p className="text-muted-foreground">Be the first to list a show in this region!</p>
                            </div>
                            <Button size="lg" asChild className="font-bold">
                                <Link href="/events/new">Post a Car Show in {state.name}</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
