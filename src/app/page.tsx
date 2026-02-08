import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Flame } from "lucide-react";
import { EventExplorer } from "@/components/home/event-explorer";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch optimized events
  const dbCall = prisma.event.findMany({
    where: { status: { in: ["APPROVED", "SUBMITTED"] } },
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
        {/* Abstract Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020817] to-[#020817] z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />

        <div className="container relative z-20 px-4 text-center max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Flame className="h-4 w-4" />
            <span>The #1 Automotive Event Calendar</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Fuel Your <span className="text-gradient-primary">Passion</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            Discover the most exclusive car shows, meetups, and track days in your area. Join a community of over 50,000 enthusiasts.
          </p>


        </div>
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
