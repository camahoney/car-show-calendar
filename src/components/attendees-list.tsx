import Image from "next/image";
import { Car } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface AttendeesListProps {
    rsvps: any[];
}

export function AttendeesList({ rsvps }: AttendeesListProps) {
    const cars = rsvps.filter(r => r.vehicle).map(r => r.vehicle);

    if (cars.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white/90">
                <Car className="h-5 w-5 text-primary" /> Who's Bringing What
                <span className="text-xs font-normal text-muted-foreground ml-2">({cars.length} cars)</span>
            </h3>

            <ScrollArea className="w-full whitespace-nowrap rounded-2xl pb-4">
                <div className="flex w-max space-x-4">
                    {cars.map((car, i) => (
                        <div key={i} className="flex flex-col gap-2 w-[180px] group">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted/20 border border-white/5">
                                {car.photoUrl ? (
                                    <Image
                                        src={car.photoUrl}
                                        alt={car.model}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Car className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white truncate">{car.year} {car.model}</p>
                                <p className="text-xs text-muted-foreground truncate">{car.make}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
