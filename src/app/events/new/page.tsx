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
        <div className="min-h-screen bg-background relative overflow-hidden pb-32">
            {/* Pulse Engine Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="hero-mesh-1 opacity-50 mix-blend-screen" />
                <div className="hero-mesh-2 opacity-40 mix-blend-screen animate-float" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
            </div>

            <div className="container relative z-10 mx-auto py-16 px-4 pt-32 max-w-5xl">
                <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-[5rem] font-black tracking-tighter text-white drop-shadow-2xl leading-[1.1]">
                        POST AN EVENT
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium tracking-wide max-w-2xl mx-auto drop-shadow-md">
                        Get your show in front of thousands of local enthusiasts. Choose a tier, fill in the details, and go live.
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both">
                    <EventForm />
                </div>
            </div>
        </div>
    );
}
