"use client";

import { useRouteStore } from "@/lib/route-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Map, X, GripVertical, Navigation, Trash2, Clock, Car } from "lucide-react";
import { format } from "date-fns";
import { getOptimizedRoute } from "@/lib/mapbox";
import { toast } from "sonner";
import { useState } from "react";

export function RoutePlannerSidebar() {
    const { stops, isOpen, setIsOpen, removeStop, clearRoute, tripStats, setRouteData } = useRouteStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculateRoute = async () => {
        if (stops.length < 2) return;
        setIsLoading(true);
        try {
            const sortedStops = [...stops].sort((a, b) => a.order - b.order);
            const coordinates = sortedStops.map(s => [s.event.longitude, s.event.latitude] as [number, number]);

            const result = await getOptimizedRoute(coordinates);

            if (result) {
                setRouteData(
                    { distance: result.distance, duration: result.duration },
                    result.geometry
                );
                toast.success("Route generated!");
            } else {
                toast.error("Could not calculate route.");
            }
        } catch (error) {
            toast.error("Failed to calculate route.");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to format duration (seconds to hours/mins)
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
    };

    // Helper to format distance (meters to miles)
    const formatDistance = (meters: number) => {
        return `${(meters * 0.000621371).toFixed(1)} miles`;
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {/* Trigger is handled by the map UI or separate button, but we keep this here if needed */}
            <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0 bg-background/95 backdrop-blur-xl border-r border-white/10">
                <div className="h-full flex flex-col">
                    <SheetHeader className="p-6 border-b border-white/10">
                        <SheetTitle className="flex items-center gap-2 text-2xl">
                            <Map className="w-6 h-6 text-primary" />
                            Route Planner
                        </SheetTitle>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                            <span>{stops.length} Stop{stops.length !== 1 ? 's' : ''} Selected</span>
                            {stops.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearRoute} className="h-auto p-0 text-red-400 hover:text-red-300">
                                    Clear All
                                </Button>
                            )}
                        </div>

                        {tripStats && (
                            <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 flex gap-4">
                                <div className="flex-1 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1 text-primary">
                                        <Car className="w-4 h-4" />
                                        <span className="font-bold">Distance</span>
                                    </div>
                                    <p className="text-lg font-bold">{formatDistance(tripStats.distance)}</p>
                                </div>
                                <div className="w-[1px] bg-primary/20" />
                                <div className="flex-1 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1 text-primary">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-bold">Drive Time</span>
                                    </div>
                                    <p className="text-lg font-bold">{formatDuration(tripStats.duration)}</p>
                                </div>
                            </div>
                        )}
                    </SheetHeader>

                    <ScrollArea className="flex-1 p-6">
                        {stops.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground space-y-4">
                                <Navigation className="w-12 h-12 opacity-20" />
                                <p>No stops added yet.</p>
                                <p className="text-sm">Select events on the map to add them to your trip.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stops.sort((a, b) => a.order - b.order).map((stop, index) => (
                                    <div key={stop.event.id} className="group relative flex items-start gap-3 bg-card/50 p-4 rounded-xl border border-white/5 hover:border-primary/50 transition-colors">
                                        <div className="absolute -left-3 top-6 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ring-2 ring-background z-10">
                                            {index + 1}
                                        </div>

                                        <div className="flex-1 min-w-0 ml-2">
                                            <h4 className="font-semibold truncate pr-6">{stop.event.title}</h4>
                                            <p className="text-sm text-muted-foreground truncate">{stop.event.venueName}</p>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                {format(new Date(stop.event.startDateTime), "MMM d, h:mm a")}
                                            </p>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeStop(stop.event.id)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="p-6 border-t border-white/10 bg-background/50">
                        <Button
                            className="w-full h-12 text-lg font-bold"
                            disabled={stops.length < 2 || isLoading}
                            onClick={handleCalculateRoute}
                        >
                            <Navigation className="mr-2 w-5 h-5" />
                            {isLoading ? "Calculating..." : "Calculate Route"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
