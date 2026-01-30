"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Car, Loader2 } from "lucide-react";
import { rsvpEvent } from "@/app/actions/rsvp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface RSVPButtonProps {
    eventId: string;
    isAttending: boolean;
    hasVehicles: boolean; // We could fetch this, but passing it is faster if we have it
    userVehicles: any[];
}

export function RSVPButton({ eventId, isAttending, hasVehicles, userVehicles }: RSVPButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined);
    const router = useRouter();

    async function handleRSVP() {
        setLoading(true);
        const result = await rsvpEvent(eventId, selectedVehicle);
        setLoading(false);

        if (result.success) {
            toast.success("You're on the list!");
            setOpen(false);
            router.refresh();
        } else {
            toast.error(result.error || "Failed to RSVP");
        }
    }

    if (isAttending) {
        return (
            <Button variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20">
                <Check className="mr-2 h-4 w-4" /> Going
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
                    I&apos;m Going!
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>RSVP to Event</DialogTitle>
                    <DialogDescription>
                        Let others know you&apos;re coming. Bring a car from your garage?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {userVehicles.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all ${!selectedVehicle ? 'border-primary bg-primary/10' : 'border-white/10 hover:bg-white/5'}`}
                                onClick={() => setSelectedVehicle(undefined)}
                            >
                                <span className="text-sm font-medium">Just Spectating</span>
                            </div>
                            {userVehicles.map((v) => (
                                <div
                                    key={v.id}
                                    className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all overflow-hidden relative ${selectedVehicle === v.id ? 'border-primary ring-1 ring-primary' : 'border-white/10 hover:bg-white/5'}`}
                                    onClick={() => setSelectedVehicle(v.id)}
                                >
                                    {v.photoUrl ? (
                                        <div className="absolute inset-0 opacity-40">
                                            <Image src={v.photoUrl} alt={v.model} fill className="object-cover" />
                                        </div>
                                    ) : null}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <Car className="h-5 w-5 mb-1" />
                                        <span className="text-xs font-bold truncate w-full text-center">{v.year} {v.model}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-4 border border-dashed border-white/10 rounded-xl">
                            <p className="text-sm text-muted-foreground mb-2">No cars in your garage yet.</p>
                            <Button variant="outline" size="sm" onClick={() => { setOpen(false); router.push("/garage"); }}>
                                Add a Car First
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleRSVP} disabled={loading} className="w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
