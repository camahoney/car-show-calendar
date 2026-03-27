import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Calendar, Globe, Ticket, User, Info, DollarSign, CloudRain, Heart, Map as MapIcon, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EventMap } from "@/components/event-map";
import { AddToCalendar } from "@/components/add-to-calendar";
import { ShareButtons } from "@/components/share-buttons";
import { FormattedDate } from "@/components/formatted-date";
import { ViewTracker } from "@/components/view-tracker";
import { getWeather } from "@/lib/weather";
import { WeatherWidget } from "@/components/weather-widget";
import { ClaimEventButton } from "@/components/claim-event-button";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RSVPButton } from "@/components/rsvp-button";
import { AttendeesList } from "@/components/attendees-list";
import { EventGallery } from "@/components/event-gallery";
import { UpgradeEventButton } from "@/components/upgrade-event-button";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const event = await prisma.event.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }]
        },
    });

    if (!event) return { title: "Event Not Found" };

    const isPast = new Date(event.endDateTime) < new Date();

    return {
        title: `${event.title} - Car Show Calendar`,
        description: event.description.substring(0, 160),
        openGraph: {
            images: [event.posterUrl],
        },
        ...(isPast && { robots: { index: false, follow: true } }),
    };
}

import { getMyVendor } from "@/app/actions/vendor";
import { VendorBoostButton } from "@/components/vendor-boost-button";

export default async function EventPage({ params }: PageProps) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const event = await prisma.event.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }]
        },
        include: {
            organizer: true,
            rsvps: {
                include: { vehicle: true }
            },
            photos: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!event) notFound();

    // SEO Redirect: If accessed via ID but has a slug, redirect to slug
    if (event.slug && event.slug !== slug) {
        redirect(`/events/${event.slug}`);
    }

    // User context data
    let userVehicles: any[] = [];
    let isAttending = false;
    let currentVendor = null;
    let isVendorBoosted = false;

    if (session?.user) {
        // Check if attending
        isAttending = event.rsvps.some(r => r.userId === session.user.id);

        // Fetch garage
        userVehicles = await prisma.vehicle.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        // Check Vendor Status
        currentVendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id }
        });

        if (currentVendor) {
            const boost = await prisma.vendorAppearance.findUnique({
                where: {
                    eventId_vendorId: {
                        eventId: event.id,
                        vendorId: currentVendor.id
                    }
                }
            });
            isVendorBoosted = !!boost?.isBoosted;
        }
    }

    const fullAddress = `${event.addressLine1}, ${event.city}, ${event.state} ${event.zip}`;
    const isPastEvent = new Date(event.endDateTime) < new Date();

    // Fetch weather data (skip for past events)
    const weatherData = isPastEvent ? null : await getWeather(event.latitude, event.longitude);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Pulse Engine Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Brand Gradients */}
                <div className="hero-mesh-1 opacity-40 mix-blend-screen" />
                <div className="hero-mesh-2 opacity-30 mix-blend-screen animate-float" />
                
                {/* Huge Blurred Poster */}
                <div className="absolute inset-0 h-[80vh] z-10 w-full">
                    <Image
                        src={event.posterUrl}
                        alt="Background"
                        fill
                        className="object-cover opacity-20 blur-3xl scale-110 mix-blend-screen"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-4 py-8 pt-32 space-y-8">

                {/* Past Event Banner */}
                {isPastEvent && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-amber-500/20">
                                <Clock className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-amber-200">This event has ended</p>
                                <p className="text-sm text-amber-200/70">
                                    This event took place on {format(new Date(event.startDateTime), "MMMM d, yyyy")}. Browse upcoming events to find your next show.
                                </p>
                            </div>
                        </div>
                        <Button asChild variant="outline" className="border-amber-500/30 text-amber-200 hover:bg-amber-500/10 shrink-0">
                            <Link href="/events">
                                Upcoming Events <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-4 max-w-3xl">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <Badge variant={event.tier === 'FEATURED' || event.tier === 'PREMIUM' ? 'default' : 'secondary'} className={event.tier === 'FEATURED' || event.tier === 'PREMIUM' ? "bg-primary text-white font-black tracking-widest shadow-[0_0_15px_-3px_rgba(239,68,68,0.5)] border border-red-400/30 px-4 py-1.5 backdrop-blur-md" : "backdrop-blur-md bg-white/10 text-white font-bold tracking-wide border border-white/20 px-4 py-1.5"}>
                                {event.tier === 'FEATURED' || event.tier === 'PREMIUM' ? 'FEATURED EVENT' : 'STANDARD ENTHUSIAST LISTING'}
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-gray-200 backdrop-blur-md bg-white/5 font-bold tracking-wide px-4 py-1.5">
                                {event.judgedOrCruiseIn.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-gray-200 backdrop-blur-md bg-white/5 font-bold tracking-wide px-4 py-1.5">
                                {event.status}
                            </Badge>
                            {event.isPreRelease && (
                                <Badge variant="secondary" className="bg-yellow-500 text-black font-black tracking-widest shadow-lg shadow-yellow-500/20 border-0 px-4 py-1.5">
                                    SAVE THE DATE
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-5xl md:text-[5rem] lg:text-[6rem] font-black tracking-tighter text-white leading-[1.05] drop-shadow-2xl mb-8">
                            {event.title}
                        </h1>

                        {/* Top Metadata Pills */}
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            {/* Date Pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full ultra-glass border border-white/10 shadow-lg">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <span className="text-sm font-bold text-white tracking-wide">
                                    <FormattedDate date={event.startDateTime} dateFormat="EEEE, MMMM do, yyyy" />
                                </span>
                            </div>
                            
                            {/* Time Pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full ultra-glass border border-white/10 shadow-lg">
                                <Clock className="w-5 h-5 text-orange-400" />
                                <span className="text-sm font-bold text-white tracking-wide flex items-center gap-1">
                                    <FormattedDate date={event.startDateTime} dateFormat="h:mm a" />
                                    <span className="text-muted-foreground font-normal">-</span>
                                    <FormattedDate date={event.endDateTime} dateFormat="h:mm a" />
                                </span>
                            </div>

                            {/* Location Pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full ultra-glass border border-white/10 shadow-lg">
                                <MapPin className="w-5 h-5 text-red-500" />
                                <span className="text-sm font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-none">
                                    {event.city}, {event.state}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {!isPastEvent && (
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
                        )}
                        <ShareButtons event={{ id: event.id, title: event.title }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Poster and Content components (unchanged) ... */}
                        {event.tier !== 'FREE' ? (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-card/50 backdrop-blur-sm group">
                                <Image
                                    src={event.posterUrl}
                                    alt={event.title}
                                    fill
                                    priority
                                    className="object-contain bg-black/40"
                                />
                                {event.isPreRelease && (
                                    <div className="absolute top-4 right-4 z-20 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none drop-shadow-xl">
                                        <Image
                                            src="/images/pre-release-badge.jpg"
                                            alt="Pre-Release Listing"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
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
                        <div className="ultra-glass p-8 rounded-[2rem] border border-white/10 space-y-5 shadow-2xl">
                            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-white">
                                <Info className="h-7 w-7 text-primary" /> About Event
                            </h2>
                            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed text-lg">
                                {event.description}
                            </div>
                        </div>


                        {/* Attendees Section */}
                        <div className="ultra-glass p-8 rounded-[2rem] border border-white/10 space-y-5 shadow-2xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h2 className="text-3xl font-black tracking-tight text-white">{isPastEvent ? "Who Attended" : "Who\u0027s Going"}</h2>
                                {!isPastEvent && (
                                    <RSVPButton
                                        eventId={event.id}
                                        isAttending={isAttending}
                                        hasVehicles={userVehicles.length > 0}
                                        userVehicles={userVehicles}
                                    />
                                )}
                            </div>
                            <AttendeesList rsvps={event.rsvps} />
                        </div>

                        {/* Gallery Section */}
                        <div className="ultra-glass p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                            <EventGallery
                                eventId={event.id}
                                photos={event.photos}
                                userId={session?.user?.id}
                            />
                        </div>



                        {/* Weather Section — only for upcoming events */}
                        {!isPastEvent && weatherData && (
                            <div className="ultra-glass p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-5">
                                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-white">
                                    <CloudRain className="h-7 w-7 text-primary" /> Forecast
                                </h2>
                                <WeatherWidget
                                    data={weatherData}
                                    eventDate={event.startDateTime}
                                    rainPolicy={event.rainDatePolicy}
                                />
                            </div>
                        )}

                        {/* Map Section */}
                        <div className="ultra-glass p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-5">
                            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-white">
                                <MapPin className="h-7 w-7 text-primary" /> Location
                            </h2>
                            <div className="rounded-xl overflow-hidden ring-1 ring-white/10">
                                <EventMap
                                    lat={event.latitude}
                                    lng={event.longitude}
                                    address={fullAddress}
                                    venueName={event.venueName}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-300 px-2 gap-1 bg-black/20 p-3 rounded-xl border border-white/5">
                                <p className="font-semibold text-white">{event.venueName}</p>
                                <p className="text-muted-foreground">{fullAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">
                        {/* Organizer Actions */}
                        {session?.user?.id === event.organizer.userId && event.tier !== 'FEATURED' && (
                            <UpgradeEventButton eventId={event.id} />
                        )}

                        {/* Vendor Actions - Boost Prompt */}
                        {currentVendor && (
                            <VendorBoostButton
                                eventId={event.id}
                                vendorId={currentVendor.id}
                                isBoosted={isVendorBoosted}
                            />
                        )}

                        {/* Status Card */}
                        <div className="ultra-glass p-8 rounded-[2rem] border border-primary/20 bg-primary/[0.02] shadow-[0_0_40px_-10px_rgba(239,68,68,0.15)] space-y-6">
                            <h3 className="font-black text-2xl tracking-wide border-b border-white/10 pb-4 mb-4 text-white">Event Details</h3>

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
                                                <span className="text-white">
                                                    {(event.entryFee || 0) > 0
                                                        ? (event.entryFeeMax && event.entryFeeMax > (event.entryFee || 0)
                                                            ? `$${event.entryFee} - $${event.entryFeeMax}`
                                                            : `$${event.entryFee}`)
                                                        : 'Free'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-8">
                                                <span>Spectator:</span>
                                                <span className="text-white">
                                                    {(event.spectatorFee || 0) > 0
                                                        ? (event.spectatorFeeMax && event.spectatorFeeMax > (event.spectatorFee || 0)
                                                            ? `$${event.spectatorFee} - $${event.spectatorFeeMax}`
                                                            : `$${event.spectatorFee}`)
                                                        : 'Free'}
                                                </span>
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
                                        <Link href={`/organizers/${event.organizer.id}`} className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors">
                                            {event.organizer.organizerName}
                                        </Link>
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

                            {/* Links - Only for Standard/Featured and not past events */}
                            {event.tier !== 'FREE' && (
                                <div className="pt-4 space-y-3">
                                    {!isPastEvent && event.registrationUrl && (
                                        <Button className="w-full bg-primary hover:bg-primary/90 font-black h-14 text-lg shadow-[0_0_20px_-5px_rgba(239,68,68,0.6)] animate-pulse-glow hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.8)] transition-all duration-300" asChild>
                                            <Link href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                                                <Ticket className="mr-2 h-6 w-6" /> REGISTER NOW
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
                            {(event.isClaimable || event.isPreRelease) && (
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
                            <div className="ultra-glass p-6 rounded-[2rem] border border-white/10 shadow-xl flex items-center gap-4">
                                <div className="p-4 rounded-full bg-rose-500/20 ring-1 ring-rose-500/30">
                                    <Heart className="h-6 w-6 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Benefiting Charity</p>
                                    <p className="font-black text-lg text-white">{event.charityBeneficiary}</p>
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
                        "eventStatus": isPastEvent ? "https://schema.org/EventPostponed" : "https://schema.org/EventScheduled",
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
