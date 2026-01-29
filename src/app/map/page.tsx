import { Button } from "@/components/ui/button";
import { Link as Search } from "lucide-react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const metadata = {
    title: "Event Map | Car Show Calendar",
    description: "Find car shows near you on the map.",
};

export default function MapPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
            {/* Background Gradient */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0" />

            <div className="glass p-12 rounded-2xl max-w-lg w-full space-y-6 relative z-10 border border-white/10">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-white">Map View Coming Soon</h1>
                    <p className="text-muted-foreground">
                        We're putting the finishing touches on our interactive map search.
                        In the meantime, browse our curated list of events.
                    </p>
                </div>

                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 font-bold" asChild>
                    <Link href="/events">
                        Browse Events List
                    </Link>
                </Button>
            </div>
        </div>
    );
}
