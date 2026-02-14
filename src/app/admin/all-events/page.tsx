import { prisma } from "@/lib/prisma";
import { EventsDataTable } from "./EventsDataTable";

export const dynamic = 'force-dynamic';

export default async function AdminAllEventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        include: { organizer: true },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">All Events</h1>
                    <p className="text-muted-foreground">Master list of all scheduled events.</p>
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <EventsDataTable events={events} />
            </div>
        </div>
    );
}
