"use client";

import { useWizard } from "./wizard-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";

export function StepBasicInfo() {
    const { data, updateData, setStep } = useWizard();

    // Basic Validation Check
    const canContinue = data.title && data.title.length > 3 && data.description && data.description.length > 20;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Event Basics</h2>
                <p className="text-muted-foreground">Let's start with the main details.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Event Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="title"
                        value={data.title || ""}
                        onChange={(e) => updateData({ title: e.target.value })}
                        placeholder="e.g. Austin Cars & Coffee"
                        maxLength={75}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {(data.title?.length || 0)}/75 characters
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>Event Poster <span className="text-red-500">*</span></Label>
                    <div className="max-w-[300px]">
                        <ImageUpload
                            value={data.posterUrl || ""}
                            onChange={(url) => updateData({ posterUrl: url })}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: 1080x1350px (Portrait)</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="description"
                        value={data.description || ""}
                        onChange={(e) => updateData({ description: e.target.value })}
                        placeholder="What makes this event special?"
                        className="min-h-[150px]"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {(data.description?.length || 0)}/20 chars min
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <Button
                    onClick={() => setStep(2)}
                    disabled={!canContinue}
                >
                    Next: Date & Location
                </Button>
            </div>
        </div>
    );
}
