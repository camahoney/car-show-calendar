"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Event } from "@prisma/client";
import { EventCard } from "@/components/event-card";

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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[500px] w-full bg-muted/20 animate-pulse rounded-xl" />;

    // Default center (US)
    const center: [number, number] = [39.8283, -98.5795];
    const zoom = 4;

    return (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {events.map((event) => (
                    // Only render if lat/lng exist
                    (event.latitude && event.longitude) ? (
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
                                            <a href={`/events/${event.id}`} className="block mt-2 text-xs text-primary font-bold hover:underline">
                                                View Details
                                            </a>
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
