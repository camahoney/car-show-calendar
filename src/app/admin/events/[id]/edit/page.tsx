import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/event-form";
import { notFound } from "next/navigation";

interface AdminEditEventPageProps {
    params: {
        id: string;
    };
}

export default async function AdminEditEventPage({ params }: AdminEditEventPageProps) {
    // Awaiting params to satisfy Next.js 15+ async params requirement
    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id },
    });

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Edit Event (Admin)</h1>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <EventForm initialData={{
                    ...event,
                    startDateTime: event.startDateTime.toISOString().slice(0, 16), // Format for datetime-local
                    endDateTime: event.endDateTime.toISOString().slice(0, 16),
                    rainDate: event.rainDate ? event.rainDate.toISOString() : null
                }} />
            </div>
        </div>
    );
}
