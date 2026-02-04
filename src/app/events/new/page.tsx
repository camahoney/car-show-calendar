import { EventForm } from "@/components/event-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewEventPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/signin?callbackUrl=/events/new");
    }

    // Check for existing draft?
    // We could fetch it server side and pass it.
    // For now, let Client Component handle fetching if needed, or pass initialDraft prop.

    // Actually, let's fetch draft here to avoid loading state flicker
    // import { getEventDraft } from "@/app/actions/event-wizard";
    // const draft = await getEventDraft();

    // Since getEventDraft is an async action, we can call it.
    let draft = null;
    try {
        // We need to import it dynamically or just import the function if it's "use server"
        // It is "use server" at top of file, so we can import.
        const { getEventDraft } = await import("@/app/actions/event-wizard");
        draft = await getEventDraft();
    } catch (e) {
        console.error("Failed to fetch draft", e);
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <WizardContainer initialDraft={draft} />
        </div>
    );
}

// Need to import WizardContainer
import { WizardContainer } from "@/components/event-wizard/wizard-container";
