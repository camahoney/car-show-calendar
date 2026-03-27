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
import { Plus, Map as MapIcon, Search, X, MapPin, Calendar, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Pulsing glowing dot
const pulsingDotIcon = L.divIcon({
    className: 'custom-pulsing-dot',
    html: '<div class="pulse-marker"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
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
            toast.error("Enter a location to search");
            return;
        }
        setIsSearching(true);
        try {
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
            const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchCity)}.json?access_token=${token}&country=US&limit=1`
            );
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                setSearchCenter({ lat, lng });
                toast.success(`Showing events within ${radius} mi of ${data.features[0].place_name}`);
            } else {
                toast.error("Location not found. Try 'Chicago, IL' or a zip code.");
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

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatTime = (date: Date | string) => {
        return new Date(date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="h-full w-full flex flex-col md:flex-row overflow-hidden relative">
            {/* Sidebar Explorer */}
            <div className="w-full md:w-[420px] h-[55vh] md:h-full flex-shrink-0 flex flex-col ultra-glass z-[40] border-r border-white/10 order-2 md:order-1 shadow-2xl group">
                {/* Search Header */}
                <div className="p-5 border-b border-white/5 shrink-0 bg-black/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 pointer-events-none" />
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-400 mb-4 inline-flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-primary" /> Event Explorer
                    </h2>
                    
                    <div className="flex flex-col gap-3 relative z-10">
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-1 transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]">
                            <Search className="h-4 w-4 text-muted-foreground ml-2" />
                            <Input
                                placeholder="City, State or zip code"
                                className="bg-transparent border-none outline-none h-9 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleRadiusSearch()}
                            />
                            {searchCity && (
                                <Button variant="ghost" size="icon" onClick={() => { setSearchCity(''); setSearchCenter(null); }} className="h-7 w-7 rounded-sm mr-1 hover:bg-white/10">
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={radius} onValueChange={setRadius}>
                                <SelectTrigger className="flex-1 bg-black/40 border-white/10 text-white h-10 rounded-lg transition-all focus:ring-primary/50 focus:border-primary/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="ultra-glass border-white/10">
                                    <SelectItem value="25">Within 25 miles</SelectItem>
                                    <SelectItem value="50">Within 50 miles</SelectItem>
                                    <SelectItem value="100">Within 100 miles</SelectItem>
                                    <SelectItem value="200">Within 200 miles</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Button 
                                onClick={handleRadiusSearch} 
                                disabled={isSearching} 
                                className="h-10 px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-primary/40 transition-all font-semibold"
                            >
                                {isSearching ? "Searching..." : "Find"}
                            </Button>
                        </div>
                    </div>
                </div>
                
                {/* Event Results List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-sm font-medium text-muted-foreground">
                            {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} Found
                        </span>
                        {searchCenter && (
                            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                                Filters Active
                            </Badge>
                        )}
                    </div>

                    {filteredEvents.map((event) => (
                        <div key={event.id} className="relative group/card overflow-hidden rounded-xl border border-white/5 bg-black/40 p-4 transition-all hover:border-primary/30 hover:bg-black/60 hover:shadow-[0_0_40px_-15px_rgba(239,68,68,0.2)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg leading-tight mb-2 text-white group-hover/card:text-primary transition-colors">{event.title}</h3>
                                
                                <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-xs text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                        <MapPin className="h-3 w-3 text-primary/70 shrink-0" />
                                        <span className="truncate">{event.city}, {event.state}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3 text-primary/70 shrink-0" />
                                        <span>{formatDate(event.startDateTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3 w-3 text-primary/70 shrink-0" />
                                        <span>{formatTime(event.startDateTime)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 flex-1 text-xs bg-white/5 hover:bg-white/10 hover:text-white"
                                        onClick={() => handleAddStop(event)}
                                        disabled={stops.some(s => s.event.id === event.id)}
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {stops.some(s => s.event.id === event.id) ? "In Trip" : "Add to Trip"}
                                    </Button>
                                    
                                    <Link href={`/events/${event.slug || event.id}`} className="flex-1">
                                        <Button
                                            size="sm"
                                            className="w-full h-8 text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/20 hover:border-primary"
                                        >
                                            Details <ChevronRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredEvents.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[200px] border border-dashed border-white/10 rounded-xl mt-4">
                            <MapPin className="h-8 w-8 text-muted-foreground/30 mb-3" />
                            <h3 className="text-sm font-semibold text-white/70 mb-1">No events found</h3>
                            <p className="text-xs text-muted-foreground">Try expanding your search radius or trying a different location.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 h-[45vh] md:h-full relative z-0 order-1 md:order-2 bg-black">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    minZoom={4}
                    maxBounds={[
                        [15.0, -170.0], // Southwest (captures Hawaii)
                        [72.0, -65.0]   // Northeast (captures Alaska & Maine)
                    ]}
                    maxBoundsViscosity={1.0}
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

                    {/* Floating Open Trip Button */}
                    {!isOpen && stops.length > 0 && (
                        <div className="absolute top-4 right-4 z-[1000]">
                            <Button onClick={() => setIsOpen(true)} className="shadow-xl bg-primary hover:bg-primary/90 glow border-white/10" size="lg">
                                <MapIcon className="mr-2 h-5 w-5" /> Active Trip ({stops.length})
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
                            style={{ color: "#ef4444", weight: 5, opacity: 0.8 }}
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
                                    icon={pulsingDotIcon}
                                >
                                    <Popup className="custom-popup">
                                        <div className="ultra-glass rounded-xl overflow-hidden shadow-2xl text-left border border-white/10 p-4">
                                            <h3 className="font-bold text-base mb-1 text-white">{event.title}</h3>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                                                <MapPin className="w-3 h-3 text-primary" /> {event.city}, {event.state}
                                            </p>
                                            
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="flex-1 h-8 text-xs bg-white/5 hover:bg-white/10"
                                                    onClick={() => handleAddStop(event)}
                                                    disabled={stops.some(s => s.event.id === event.id)}
                                                >
                                                    <Plus className="w-3 h-3 mr-1" />
                                                    Trip
                                                </Button>
                                                <Link href={`/events/${event.slug || event.id}`} className="flex-1">
                                                    <Button
                                                        size="sm"
                                                        className="w-full h-8 text-xs bg-primary hover:bg-primary/90"
                                                    >
                                                        Details
                                                    </Button>
                                                </Link>
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
