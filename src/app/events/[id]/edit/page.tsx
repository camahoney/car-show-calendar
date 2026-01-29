import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { EventForm } from "@/components/event-form";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const user = await getCurrentUser();
    if (!user) {
        redirect("/api/auth/signin");
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });

    if (!event) {
        notFound();
    }

    if (event.organizerId !== user.id) {
        redirect("/dashboard");
    }

    // Transform for Form
    const initialData = {
        ...event,
        id: event.id,
        startDateTime: event.startDateTime.toISOString().slice(0, 16),
        endDateTime: event.endDateTime.toISOString().slice(0, 16),
        rainDate: event.rainDate ? event.rainDate.toISOString().slice(0, 16) : null,
        websiteUrl: event.websiteUrl || undefined,
        facebookUrl: event.facebookUrl || undefined,
        registrationUrl: event.registrationUrl || undefined,
        vehicleRequirements: event.vehicleRequirements || undefined,
        charityBeneficiary: event.charityBeneficiary || undefined,
        contactPhone: event.contactPhone || undefined,
        posterUrl: event.posterUrl,
        rainDatePolicy: event.rainDatePolicy as "NONE" | "RAIN_OR_SHINE" | "RAIN_DATE_SET" | "TBD",
        judgedOrCruiseIn: event.judgedOrCruiseIn as "JUDGED" | "CRUISE_IN" | "BOTH",
    };

    return (
        <div className="container py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
            <EventForm initialData={initialData as any} />
        </div>
    );
}
