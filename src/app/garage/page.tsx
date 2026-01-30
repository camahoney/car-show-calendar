"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import { AddVehicleDialog } from "@/components/garage/add-vehicle-dialog";
import { VehicleCard } from "@/components/garage/vehicle-card";
import { getMyVehicles } from "@/app/actions/vehicle";

export default function GaragePage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getMyVehicles();
            setVehicles(data);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            My Garage
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your collection and choose your ride for upcoming events.
                        </p>
                    </div>
                    <AddVehicleDialog onVehicleAdded={(v) => setVehicles([...vehicles, v])} />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-2xl bg-card/50 animate-pulse" />
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-card/20 text-center">
                        <div className="p-4 rounded-full bg-primary/10 mb-4">
                            <Car className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Your garage is empty</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Add your vehicles to showcase them on your profile and RSVP to events with style.
                        </p>
                        <AddVehicleDialog onVehicleAdded={(v) => setVehicles([...vehicles, v])} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
