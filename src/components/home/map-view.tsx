"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Event } from "@prisma/client";
import { EventCard } from "@/components/event-card";
import { useRouteStore } from "@/lib/route-store";
import { RoutePlannerSidebar } from "@/components/route-planner-sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";

// Fix Leaflet marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

// Custom Icon
const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapViewProps {
    events: Event[];
}

export default function MapView({ events }: MapViewProps) {
    const { addStop, stops, setIsOpen, isOpen, routeGeometry } = useRouteStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const validEvents = events.filter(e => e.latitude && e.longitude);
        console.log(`MapView: Received ${events.length} events. Valid coordinates: ${validEvents.length}`);
        if (events.length > 0 && validEvents.length === 0) {
            console.warn("MapView: Events found but none have valid coordinates (0,0?)");
        }
    }, [events]);

    if (!isMounted) return <div className="h-[500px] w-full bg-muted/20 animate-pulse rounded-xl" />;

    // Default center (US)
    const center: [number, number] = [39.8283, -98.5795];
    const zoom = 4;



    const handleAddStop = (event: Event) => {
        addStop(event as any); // Type cast for now as store expects & { organizer: any } but plain event is ok for ID
        toast.success("Added to trip!");
        setIsOpen(true);
    };

    return (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <RoutePlannerSidebar />

                {/* Floating Open Button */}
                {!isOpen && stops.length > 0 && (
                    <div className="absolute top-4 right-4 z-[1000]">
                        <Button onClick={() => setIsOpen(true)} className="shadow-xl" size="lg">
                            <MapIcon className="mr-2 h-5 w-5" /> Trip ({stops.length})
                        </Button>
                    </div>
                )}

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {routeGeometry && (
                    <GeoJSON
                        key={JSON.stringify(routeGeometry)} // Force re-render on change
                        data={routeGeometry}
                        style={{ color: "#d946ef", weight: 5, opacity: 0.8 }}
                    />
                )}

                {events.map((event) => (
                    // Only render if lat/lng exist and are not 0 (though fallback should prevent 0)
                    (event.latitude !== undefined && event.longitude !== undefined && event.latitude !== 0) ? (
                        <Marker
                            key={event.id}
                            position={[event.latitude, event.longitude]}
                            icon={customIcon}
                        >
                            <Popup className="custom-popup bg-transparent border-none p-0">
                                <div className="w-[280px]">
                                    {/* Minimal Card */}
                                    <div className="bg-background border border-white/10 rounded-lg overflow-hidden shadow-xl text-left">
                                        {/* We can't reuse EventCard easily inside Popup due to hydration issues sometimes, but let's try a simple version */}
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm truncate">{event.title}</h3>
                                            <p className="text-xs text-muted-foreground">{event.city}, {event.state}</p>
                                            <a href={`/events/${event.slug || event.id}`} className="block mt-2 text-xs text-primary font-bold hover:underline mb-2">
                                                View Details
                                            </a>
                                            <Button
                                                size="sm"
                                                className="w-full h-7 text-xs"
                                                onClick={() => handleAddStop(event)}
                                                disabled={stops.some(s => s.event.id === event.id)}
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                {stops.some(s => s.event.id === event.id) ? "Added" : "Add to Trip"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
}
