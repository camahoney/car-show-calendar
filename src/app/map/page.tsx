import { prisma } from "@/lib/prisma";
import MapWrapper from "@/components/home/map-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Event Map | Car Show Calendar",
    description: "Find car shows and automotive events near you.",
};

export const dynamic = 'force-dynamic';

export default async function MapPage() {
    // Fetch upcoming APPROVED events
    const events = await prisma.event.findMany({
        where: {
            status: { in: ["APPROVED", "PUBLISHED", "SUBMITTED"] },
            endDateTime: {
                gte: new Date(),
            },
        },
        include: {
            organizer: true,
        },
    });

    return (
        <div className="h-screen w-full pt-20">
            <MapWrapper events={events} />
        </div>
    );
}
