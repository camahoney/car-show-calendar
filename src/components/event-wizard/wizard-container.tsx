"use client";

import { WizardProvider, useWizard } from "./wizard-context";
import { StepBasicInfo } from "./step-basic-info";
import { StepDateLocation } from "./step-date-location";
import { StepDetails } from "./step-details";
import { Button } from "@/components/ui/button";

function WizardContent() {
    const { step, isSaving, saveDraft } = useWizard();

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Create Event</h1>
                    <p className="text-muted-foreground">Step {step} of 3</p>
                </div>
                <Button variant="outline" onClick={saveDraft} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Draft"}
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            {/* Steps */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {step === 1 && <StepBasicInfo />}
                {step === 2 && <StepDateLocation />}
                {step === 3 && <StepDetails />}
            </div>
        </div>
    );
}

export function WizardContainer({ initialDraft }: { initialDraft?: any }) {
    // Parse initial draft if exists
    let initialData = undefined;
    if (initialDraft) {
        try {
            initialData = JSON.parse(initialDraft.data);
            initialData.step = initialDraft.step;
        } catch (e) { console.error("Failed to parse draft", e); }
    }

    return (
        <WizardProvider initialData={initialData} initialStep={initialDraft?.step || 1} initialDraftId={initialDraft?.id}>
            <WizardContent />
        </WizardProvider>
    );
}
