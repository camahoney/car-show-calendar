"use client";

import { useWizard } from "./wizard-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
// Import Checkbox if needed for 'Rain Date Policy'

export function StepDateLocation() {
    const { data, updateData, setStep } = useWizard();

    const canContinue = data.venueName && data.addressLine1 && data.city && data.state && data.startDateTime && data.endDateTime;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">When & Where</h2>
                <p className="text-muted-foreground">Help attendees find your event.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Date Time */}
                <div className="space-y-4">
                    <Label>Date & Time <span className="text-red-500">*</span></Label>
                    <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Start</Label>
                        <Input
                            type="datetime-local"
                            value={data.startDateTime ? new Date(data.startDateTime).toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateData({ startDateTime: e.target.value ? new Date(e.target.value) : undefined })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">End</Label>
                        <Input
                            type="datetime-local"
                            value={data.endDateTime ? new Date(data.endDateTime).toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateData({ endDateTime: e.target.value ? new Date(e.target.value) : undefined })}
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                    <Label>Location <span className="text-red-500">*</span></Label>
                    <div className="space-y-2">
                        <Input
                            placeholder="Venue Name (e.g. COTA)"
                            value={data.venueName || ""}
                            onChange={(e) => updateData({ venueName: e.target.value })}
                        />
                        <Input
                            placeholder="Address Line 1"
                            value={data.addressLine1 || ""}
                            onChange={(e) => updateData({ addressLine1: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="City"
                                value={data.city || ""}
                                onChange={(e) => updateData({ city: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="State"
                                    maxLength={2}
                                    value={data.state || ""}
                                    onChange={(e) => updateData({ state: e.target.value })}
                                />
                                <Input
                                    placeholder="Zip"
                                    value={data.zip || ""}
                                    onChange={(e) => updateData({ zip: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Mapbox Geocoding would go here */}
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!canContinue}>Next: Fees & Details</Button>
            </div>
        </div>
    );
}
