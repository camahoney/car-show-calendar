import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Flame } from "lucide-react";
import { EventExplorer } from "@/components/home/event-explorer";
import { HeroContent } from "@/components/home/hero-content";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Only show events whose start date is today or in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dbCall = prisma.event.findMany({
    where: {
      status: { in: ["APPROVED", "SUBMITTED"] },
      startDateTime: { gte: today },
    },
    orderBy: [{ startDateTime: 'asc' }],
    take: 50,
    include: { organizer: true }
  });

  const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const events = await Promise.race([
    dbCall,
    timeout(4000).then(() => [])
  ]) as any[];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-white/5 pt-24">
        {/* Advanced Dynamic Background */}
        <div className="hero-mesh-1" />
        <div className="hero-mesh-2" />
        
        <div className="absolute inset-0 bg-[#020817] z-0 opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-transparent to-transparent z-10" />

        <HeroContent />
      </section>

      {/* Main Content / Event Explorer */}
      <section className="py-12 relative z-10 -mt-20">
        <div className="container mx-auto px-4">
          <EventExplorer initialEvents={events} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-t from-primary/10 to-transparent border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Showcase?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Organizers get free access to our premium listing tools. Manage registrations, promote your event, and track analytics.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 text-lg font-medium" asChild>
              <Link href="/events/new">Create Event</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-lg font-medium bg-transparent border-white/10 hover:bg-white/5" asChild>
              <Link href="/dashboard">Organizer Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
