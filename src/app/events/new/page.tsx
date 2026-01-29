import { EventForm } from "@/components/event-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewEventPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/signin?callbackUrl=/events/new");
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Submit a New Event</h1>
            <EventForm />
        </div>
    );
}
