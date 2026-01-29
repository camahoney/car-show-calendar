"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventMapProps {
    lat?: number;
    lng?: number;
    address: string;
    venueName?: string;
}

export function EventMap({ lat, lng, address, venueName }: EventMapProps) {
    const [useMapbox, setUseMapbox] = useState(false);

    useEffect(() => {
        // Check if Mapbox token exists
        if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
            setUseMapbox(true);
        }
    }, []);

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        (venueName ? venueName + ", " : "") + address
    )}`;

    return (
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-muted/20 group">
            {/* Fallback to simple iframe or placeholder if no token */}
            {/* Using standard iframe for now as it is most reliable without an API key */}
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent((venueName ? venueName + " " : "") + address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
            />

            {/* Overlay Button */}
            <div className="absolute bottom-4 right-4 z-10">
                <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                    onClick={() => window.open(googleMapsUrl, '_blank')}
                >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                </Button>
            </div>

            {/* Glass Overlay Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="glass px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-medium text-white/90">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {venueName || "Event Location"}
                </div>
            </div>
        </div>
    );
}
