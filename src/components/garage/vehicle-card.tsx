import Image from "next/image";
import { Car } from "lucide-react";

interface VehicleProps {
    vehicle: {
        id: string;
        year: number;
        make: string;
        model: string;
        nickname?: string;
        photoUrl?: string;
    }
}

export function VehicleCard({ vehicle }: VehicleProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-card border border-white/5 shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-[4/3] relative bg-muted/50 overflow-hidden">
                {vehicle.photoUrl ? (
                    <Image
                        src={vehicle.photoUrl}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                        <Car className="h-16 w-16" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4">
                    {vehicle.nickname && (
                        <p className="text-sm font-medium text-primary mb-0.5 font-mono uppercase tracking-wider">
                            {vehicle.nickname}
                        </p>
                    )}
                    <h3 className="text-2xl font-bold text-white leading-tight">
                        {vehicle.year} {vehicle.make}
                    </h3>
                    <p className="text-xl text-white/80 font-semibold">{vehicle.model}</p>
                </div>
            </div>
        </div>
    );
}
