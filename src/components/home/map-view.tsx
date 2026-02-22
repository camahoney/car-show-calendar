"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Event } from "@prisma/client";
import { useRouteStore } from "@/lib/route-store";
import { RoutePlannerSidebar } from "@/components/route-planner-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Map as MapIcon, Search, X } from "lucide-react";
import { toast } from "sonner";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Fix Leaflet marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Haversine distance in miles
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth radius in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Component to fly the map to a location
function FlyToLocation({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }, [lat, lng, zoom, map]);
    return null;
}

interface MapViewProps {
    events: Event[];
}

export default function MapView({ events }: MapViewProps) {
    const { addStop, stops, setIsOpen, isOpen, routeGeometry } = useRouteStore();
    const [isMounted, setIsMounted] = useState(false);

    // Radius search state
    const [searchCity, setSearchCity] = useState("");
    const [radius, setRadius] = useState("50");
    const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleRadiusSearch = useCallback(async () => {
        if (!searchCity.trim()) {
            toast.error("Enter a city name");
            return;
        }
        setIsSearching(true);
        try {
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
            const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchCity)}.json?access_token=${token}&country=US&types=place&limit=1`
            );
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                setSearchCenter({ lat, lng });
                toast.success(`Showing events within ${radius} mi of ${data.features[0].text}`);
            } else {
                toast.error("City not found. Try a different search.");
            }
        } catch {
            toast.error("Search failed. Please try again.");
        } finally {
            setIsSearching(false);
        }
    }, [searchCity, radius]);

    const clearSearch = () => {
        setSearchCenter(null);
        setSearchCity("");
    };

    if (!isMounted) return <div className="h-[500px] w-full bg-muted/20 animate-pulse rounded-xl" />;

    // Default center (US)
    const center: [number, number] = [39.8283, -98.5795];
    const zoom = 4;

    const handleAddStop = (event: Event) => {
        addStop(event as any);
        toast.success("Added to trip!");
        setIsOpen(true);
    };

    // Filter events by radius if search is active
    const filteredEvents = searchCenter
        ? events.filter(e =>
            e.latitude && e.longitude &&
            haversineDistance(searchCenter.lat, searchCenter.lng, e.latitude, e.longitude) <= Number(radius)
        )
        : events;

    // Determine zoom based on radius
    const getRadiusZoom = (r: number) => {
        if (r <= 25) return 9;
        if (r <= 50) return 8;
        if (r <= 100) return 7;
        return 6;
    };

    return (
        <div className="h-full w-full flex flex-col">
            {/* Radius Search Bar */}
            <div className="bg-background/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex flex-wrap items-center gap-3 z-20">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="City name (e.g. Chicago)"
                        className="bg-black/20 border-white/10 h-9"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRadiusSearch()}
                    />
                </div>
                <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger className="w-[130px] bg-transparent border-white/10 text-white h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="25">Within 25 mi</SelectItem>
                        <SelectItem value="50">Within 50 mi</SelectItem>
                        <SelectItem value="100">Within 100 mi</SelectItem>
                        <SelectItem value="200">Within 200 mi</SelectItem>
                    </SelectContent>
                </Select>
                <Button size="sm" onClick={handleRadiusSearch} disabled={isSearching} className="h-9">
                    {isSearching ? "..." : "Search"}
                </Button>
                {searchCenter && (
                    <Button size="sm" variant="ghost" onClick={clearSearch} className="h-9 text-muted-foreground">
                        <X className="h-4 w-4 mr-1" /> Clear
                    </Button>
                )}
                {searchCenter && (
                    <span className="text-xs text-muted-foreground">
                        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                    </span>
                )}
            </div>

            {/* Map */}
            <div className="flex-1 relative z-0">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <RoutePlannerSidebar />

                    {/* Pan to search result */}
                    {searchCenter && (
                        <FlyToLocation
                            lat={searchCenter.lat}
                            lng={searchCenter.lng}
                            zoom={getRadiusZoom(Number(radius))}
                        />
                    )}

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
                            key={JSON.stringify(routeGeometry)}
                            data={routeGeometry}
                            style={{ color: "#d946ef", weight: 5, opacity: 0.8 }}
                        />
                    )}

                    <MarkerClusterGroup
                        chunkedLoading
                        maxClusterRadius={60}
                        spiderfyOnMaxZoom
                        showCoverageOnHover={false}
                    >
                        {filteredEvents.map((event) =>
                            event.latitude !== undefined && event.longitude !== undefined && event.latitude !== 0 ? (
                                <Marker
                                    key={event.id}
                                    position={[event.latitude, event.longitude]}
                                    icon={customIcon}
                                >
                                    <Popup className="custom-popup bg-transparent border-none p-0">
                                        <div className="w-[280px]">
                                            <div className="bg-background border border-white/10 rounded-lg overflow-hidden shadow-xl text-left">
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
                        )}
                    </MarkerClusterGroup>
                </MapContainer>
            </div>
        </div>
    );
}
