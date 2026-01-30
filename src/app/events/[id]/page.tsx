import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Calendar, Globe, Ticket, User, Info, DollarSign, CloudRain, Heart, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EventMap } from "@/components/event-map";
import { AddToCalendar } from "@/components/add-to-calendar";
import { ShareButtons } from "@/components/share-buttons";
import { ViewTracker } from "@/components/view-tracker";
import { getWeather } from "@/lib/weather";
import { WeatherWidget } from "@/components/weather-widget";
import { ClaimEventButton } from "@/components/claim-event-button";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RSVPButton } from "@/components/rsvp-button";
import { AttendeesList } from "@/components/attendees-list";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id },
    });

    if (!event) return { title: "Event Not Found" };

    return {
        title: `${event.title} - Car Show Calendar`,
        description: event.description.substring(0, 160),
        openGraph: {
            images: [event.posterUrl],
        }
    };
}

export default async function EventPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            organizer: true,
            rsvps: {
                include: { vehicle: true }
            }
        }
    });

    if (!event) notFound();

    // User context data
    let userVehicles: any[] = [];
    let isAttending = false;

    if (session?.user) {
        // Check if attending
        isAttending = event.rsvps.some(r => r.userId === session.user.id);

        // Fetch garage
        userVehicles = await prisma.vehicle.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });
    }

    const fullAddress = `${event.addressLine1}, ${event.city}, ${event.state} ${event.zip}`;

    // Fetch weather data
    const weatherData = await getWeather(event.latitude, event.longitude);

    return (
        <div className="min-h-screen bg-background pb-20">
            priority
                    />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />

            <div className="container relative z-10 mx-auto px-4 py-8 pt-32 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-4 max-w-3xl">
                        <div className="flex flex-wrap gap-3">
                            <Badge variant={event.tier === 'FEATURED' ? 'default' : 'secondary'} className={event.tier === 'FEATURED' ? "bg-primary text-white shadow-lg shadow-primary/20 backdrop-blur-md" : "backdrop-blur-md bg-white/10 text-white"}>
                                {event.tier === 'FEATURED' ? 'Featured Event' : 'Standard Event'}
                            </Badge>
                            <Badge variant="outline" className="border-white/10 text-gray-200 backdrop-blur-md bg-black/20">
                                {event.judgedOrCruiseIn.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="border-white/10 text-gray-200 backdrop-blur-md bg-black/20">
                                {event.status}
                            </Badge>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight drop-shadow-2xl">
                            {event.title}
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-300 text-lg font-medium drop-shadow-md">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span>{format(new Date(event.startDateTime), "EEEE, MMMM do, yyyy")}</span>
                                <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
                                    {format(new Date(event.startDateTime), "h:mm a")} - {format(new Date(event.endDateTime), "h:mm a")}
                                </span>
                            </div>
                            <div className="hidden sm:block text-white/10">•</div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span>{event.city}, {event.state}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <AddToCalendar
                            event={{
                                title: event.title,
                                description: event.description,
                                startDateTime: event.startDateTime,
                                endDateTime: event.endDateTime,
                                venueName: event.venueName,
                                address: fullAddress
                            }}
                        />
                        <ShareButtons event={{ id: event.id, title: event.title }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Poster - Only for Standard/Featured */}
                        {event.tier !== 'FREE' ? (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-card/50 backdrop-blur-sm group">
                                <Image
                                    src={event.posterUrl}
                                    alt={event.title}
                                    fill
                                    priority
                                    className="object-contain bg-black/40"
                                />
                            </div>
                        ) : (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 bg-card/10 flex items-center justify-center">
                                <div className="text-center space-y-2 p-6">
                                    <Image
                                        src="/logo-wide.png" // Fallback placeholder or just opacity
                                        alt="Placeholder"
                                        width={200}
                                        height={100}
                                        className="mx-auto opacity-20 grayscale"
                                    />
                                    <p className="text-muted-foreground text-sm">Image available in detailed view</p>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="glass p-8 rounded-2xl space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Info className="h-6 w-6 text-primary" /> About Event
                            </h2>
                            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
                                {event.description}
                            </div>
                        </div>

                        {/* Attendees Section */}
                        <div className="glass p-6 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Who&apos;s Going</h2>
                                <RSVPButton
                                    eventId={event.id}
                                    isAttending={isAttending}
                                    hasVehicles={userVehicles.length > 0}
                                    userVehicles={userVehicles}
                                />
                            </div>
                            <AttendeesList rsvps={event.rsvps} />
                        </div>


                        {/* Weather Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <CloudRain className="h-6 w-6 text-primary" /> Forecast
                            </h2>
                            <WeatherWidget
                                data={weatherData}
                                eventDate={event.startDateTime}
                                rainPolicy={event.rainDatePolicy}
                            />
                        </div>

                        {/* Map Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <MapPin className="h-6 w-6 text-primary" /> Location
                            </h2>
                            <EventMap
                                lat={event.latitude}
                                lng={event.longitude}
                                address={fullAddress}
                                venueName={event.venueName}
                            />
                            <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                                <p>{event.venueName}</p>
                                <p>{fullAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="glass p-6 rounded-2xl space-y-6">
                            <h3 className="font-semibold text-lg border-b border-white/5 pb-4 mb-4">Event Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Fees</p>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="flex justify-between gap-8">
                                                <span>Show Car:</span>
                                                <span className="text-white">{(event.entryFee || 0) > 0 ? `$${event.entryFee}` : 'Free'}</span>
                                            </div>
                                            <div className="flex justify-between gap-8">
                                                <span>Spectator:</span>
                                                <span className="text-white">{(event.spectatorFee || 0) > 0 ? `$${event.spectatorFee}` : 'Free'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Organizer</p>
                                        <p className="text-sm text-muted-foreground">{event.organizer.organizerName}</p>
                                    </div>
                                </div>

                                {event.rainDatePolicy !== 'NONE' && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <CloudRain className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Rain Policy</p>
                                            <p className="text-sm text-muted-foreground">
                                                {event.rainDatePolicy === 'RAIN_OR_SHINE' && "Rain or Shine"}
                                                {event.rainDatePolicy === 'RAIN_DATE_SET' && `Rain Date: ${event.rainDate ? format(new Date(event.rainDate), "MMM d") : 'TBA'}`}
                                                {event.rainDatePolicy === 'TBD' && "TBD"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Links - Only for Standard/Featured */}
                            {event.tier !== 'FREE' && (
                                <div className="pt-4 space-y-3">
                                    {event.registrationUrl && (
                                        <Button className="w-full bg-primary hover:bg-primary/90 font-bold h-12 text-lg shadow-lg shadow-primary/20" asChild>
                                            <Link href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                                                <Ticket className="mr-2 h-5 w-5" /> Register Now
                                            </Link>
                                        </Button>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        {event.websiteUrl && (
                                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
                                                <Link href={event.websiteUrl} target="_blank" rel="noopener noreferrer">
                                                    Website
                                                </Link>
                                            </Button>
                                        )}
                                        {event.facebookUrl && (
                                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
                                                <Link href={event.facebookUrl} target="_blank" rel="noopener noreferrer">
                                                    Facebook
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Upgrade Prompt for Viewer (Optional - could implement logic to show "Upgrade" if owner) */}
                            {event.isClaimable && (
                                <div className="mt-6">
                                    <ClaimEventButton eventId={event.id} />
                                    <p className="text-xs text-center text-muted-foreground mt-2">
                                        Is this your event? Claim it to manage details.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Charity Card */}
                        {event.charityBeneficiary && (
                            <div className="glass p-6 rounded-2xl flex items-center gap-4">
                                <div className="p-3 rounded-full bg-rose-500/20">
                                    <Heart className="h-6 w-6 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Benefiting Charity</p>
                                    <p className="font-semibold text-white">{event.charityBeneficiary}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>



            <ViewTracker eventId={event.id} />

            {/* Structured Data (JSON-LD) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Event",
                        "name": event.title,
                        "startDate": event.startDateTime,
                        "endDate": event.endDateTime,
                        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                        "eventStatus": "https://schema.org/EventScheduled",
                        "location": {
                            "@type": "Place",
                            "name": event.venueName,
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": event.addressLine1,
                                "addressLocality": event.city,
                                "addressRegion": event.state,
                                "postalCode": event.zip,
                                "addressCountry": "US"
                            }
                        },
                        "image": [event.posterUrl],
                        "description": event.description,
                        "organizer": {
                            "@type": "Person",
                            "name": event.organizer.organizerName
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": event.entryFee || 0,
                            "priceCurrency": "USD",
                            "url": `${process.env.NEXTAUTH_URL}/events/${event.id}`,
                            "availability": "https://schema.org/InStock"
                        }
                    })
                }}
            />
        </div >
    );
}
