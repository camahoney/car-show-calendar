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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addVehicle } from "@/app/actions/vehicle";

export function AddVehicleDialog({ onVehicleAdded }: { onVehicleAdded: (v: any) => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        year: "",
        make: "",
        model: "",
        nickname: "",
        photoUrl: "", // We can use a simple input for now, or upload logic later
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!formData.year || !formData.make || !formData.model) {
            toast.error("Please fill in required fields");
            setLoading(false);
            return;
        }

        try {
            const result = await addVehicle({
                ...formData,
                year: parseInt(formData.year)
            });

            if (result.success) {
                toast.success("Vehicle added to garage!");
                onVehicleAdded(result.vehicle);
                setOpen(false);
                setFormData({ year: "", make: "", model: "", nickname: "", photoUrl: "" });
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Plus className="h-4 w-4" /> Add Vehicle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to Garage</DialogTitle>
                    <DialogDescription>
                        Show off your ride. This will be visible on your profile and RSVPS.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right">Year</Label>
                        <Input
                            id="year"
                            type="number"
                            placeholder="2024"
                            className="col-span-3"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="make" className="text-right">Make</Label>
                        <Input
                            id="make"
                            placeholder="Porsche"
                            className="col-span-3"
                            value={formData.make}
                            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="model" className="text-right">Model</Label>
                        <Input
                            id="model"
                            placeholder="911 GT3"
                            className="col-span-3"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nickname" className="text-right">Name (Opt)</Label>
                        <Input
                            id="nickname"
                            placeholder="e.g. The Widowmaker"
                            className="col-span-3"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        />
                    </div>
                    {/* Photo URL for now - easier than upload implementation immediately */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="photo" className="text-right">Photo URL</Label>
                        <Input
                            id="photo"
                            placeholder="https://..."
                            className="col-span-3"
                            value={formData.photoUrl}
                            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Park It
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
