"use client";

import { useWizard } from "./wizard-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { publishEvent } from "@/app/actions/event-wizard";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function StepDetails() {
    const { data, updateData, setStep, draftId } = useWizard();
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        if (!draftId) {
            toast.error("Please save draft first (auto-saving...)");
            // should trigger save logic
            return;
        }

        setIsPublishing(true);
        try {
            const result = await publishEvent(draftId);
            if (result.success && result.slug) {
                toast.success("Event Submitted for Review!");
                router.push(`/events/${result.slug}`);
            } else {
                toast.error(result.error || "Failed to publish");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Details & Fees</h2>
                <p className="text-muted-foreground">Almost done!</p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Event Type</Label>
                        <Select
                            value={data.judgedOrCruiseIn || "BOTH"}
                            onValueChange={(val) => updateData({ judgedOrCruiseIn: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="JUDGED">Car Show (Judged)</SelectItem>
                                <SelectItem value="CRUISE_IN">Cruise-In (Casual)</SelectItem>
                                <SelectItem value="BOTH">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Entry Fee ($)</Label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={data.entryFee || ""}
                            onChange={(e) => updateData({ entryFee: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Leave empty or 0 for free.</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Contact Email (Optional)</Label>
                    <Input
                        type="email"
                        placeholder="organizer@example.com"
                        value={data.contactEmail || ""}
                        onChange={(e) => updateData({ contactEmail: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Website / Registration Link (Optional)</Label>
                    <Input
                        placeholder="https://..."
                        value={data.websiteUrl || ""}
                        onChange={(e) => updateData({ websiteUrl: e.target.value })}
                    />
                </div>

                <div className="border border-white/10 rounded-lg p-4 bg-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Rain Date Policy</Label>
                            <p className="text-xs text-muted-foreground">Do you have a backup date?</p>
                        </div>
                        <Select
                            value={data.rainDatePolicy || "NONE"}
                            onValueChange={(val) => updateData({ rainDatePolicy: val })}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NONE">No Rain Date</SelectItem>
                                <SelectItem value="RAIN_OR_SHINE">Rain or Shine</SelectItem>
                                <SelectItem value="RAIN_DATE_SET">Specific Date</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <div className="flex gap-2">
                    {/* Save Draft Button could go here too */}
                    <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-green-600 hover:bg-green-700 font-bold"
                    >
                        {isPublishing ? "Submitting..." : "Submit Event"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
