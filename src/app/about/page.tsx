import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Map, Users, Trophy } from "lucide-react";

export const metadata = {
    title: "About Us | Car Show Calendar",
    description: "Learn about our mission to connect the automotive community through the world's best car show discovery platform.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/logo-wide.png" // Ideally a lifestyle shot of a car show, but logo is safe fallback or use a placeholder
                    alt="Car Show Crowd"
                    fill
                    className="object-cover opacity-20 blur-sm scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 drop-shadow-2xl">
                        Driven by <span className="text-primary">Passion</span>.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                        We are building the definitive digital home for the car culture community.
                        No more broken websites, dead links, or missed events.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white border-l-4 border-primary pl-6">Our Mission</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Car Show Calendar was born from a simple frustration: it's too hard to find good car shows.
                            Legacy directories are outdated, hard to use on mobile, and often abandoned.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We believe car enthusiasts deserve a modern, beautiful platform that respects their passion.
                            Our mission is to index every car show, cruise-in, and meet across the nation, making them discoverable within seconds.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <FeatureCard
                            icon={Calendar}
                            title="Comprehensive"
                            desc="From massive nationals to local Friday night meets."
                        />
                        <FeatureCard
                            icon={Map}
                            title="Local First"
                            desc="Powerful map-based discovery for finding what's nearby."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Community"
                            desc="Connect with organizers and fellow enthusiasts."
                        />
                        <FeatureCard
                            icon={Trophy}
                            title="Premium"
                            desc="A showcase worthy of the cars you build."
                        />
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="border-t border-white/5 bg-white/5">
                <div className="container mx-auto px-4 py-24 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Join the Movement</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Whether you're an organizer looking to promote your show or an enthusiast looking for your next destination.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-lg px-8 font-bold" asChild>
                            <Link href="/events">Find a Show</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 font-bold border-white/10 hover:bg-white/10" asChild>
                            <Link href="/events/new">Post an Event</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-xl hover:bg-white/5 transition-colors">
            <Icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
    );
}
