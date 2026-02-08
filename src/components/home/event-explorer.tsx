"use client";

import { useState } from "react";
import { Event } from "@prisma/client";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Map as MapIcon, Search } from "lucide-react";
import MapWrapper from "@/components/home/map-wrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventExplorerProps {
    initialEvents: any[]; // Prisma Event Type
}

export function EventExplorer({ initialEvents }: EventExplorerProps) {
    const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState("all");

    // Extract unique states from events
    const states = Array.from(new Set(initialEvents.map(e => e.state).filter(Boolean))).sort();

    // Basic client-side filtering (ideally server-side for scale)
    const filteredEvents = initialEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.organizer?.organizerName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesState = selectedState === "all" || event.state === selectedState;

        return matchesSearch && matchesState;
    });

    return (
        <>
            {/* Search & Toggle Bar */}
            <div className="bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 relative z-30">
                <div className="relative flex-grow flex gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            placeholder="Search events, cities..."
                            className="h-12 pl-12 bg-transparent border-none text-lg focus-visible:ring-0 placeholder:text-muted-foreground/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="min-w-[140px] hidden md:block">
                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-12 bg-transparent border-none focus:ring-0 text-muted-foreground">
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                {states.map(state => (
                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant={viewMode === "grid" ? "default" : "outline"}
                        className={`h-12 w-12 rounded-xl ${viewMode === "grid" ? "bg-primary" : "bg-white/5 border-white/10"}`}
                        onClick={() => setViewMode("grid")}
                        title="List View"
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button
                        size="icon"
                        variant={viewMode === "map" ? "default" : "outline"}
                        className={`h-12 w-12 rounded-xl ${viewMode === "map" ? "bg-primary" : "bg-white/5 border-white/10"}`}
                        onClick={() => setViewMode("map")}
                        title="Map View"
                    >
                        <MapIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="py-8 min-h-[500px]">
                {viewMode === "grid" ? (
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">Upcoming Events</h2>
                                <p className="text-muted-foreground">Curated selection of premier automotive gatherings.</p>
                            </div>
                        </div>

                        {filteredEvents.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground text-lg">No events found matching your search.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="container mx-auto px-4">
                        <MapWrapper events={filteredEvents} />
                    </div>
                )}
            </div>
        </>
    );
}
