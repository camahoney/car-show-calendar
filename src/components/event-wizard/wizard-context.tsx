"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { saveEventDraft } from "@/app/actions/event-wizard";
// import { EventDraftData } from "@/app/actions/event-wizard"; // Types need to be shared or manual

// Manual Type for now (matching Server Action)
type EventDraftData = {
    step: number;
    title?: string;
    description?: string;
    startDateTime?: Date;
    endDateTime?: Date;
    venueName?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    zip?: string;
    // ... other fields
    [key: string]: any;
};

type WizardContextType = {
    step: number;
    setStep: (step: number) => void;
    data: EventDraftData;
    updateData: (newData: Partial<EventDraftData>) => void;
    saveDraft: () => Promise<void>;
    isSaving: boolean;
    draftId: string | undefined;
    setDraftId: (id: string) => void;
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children, initialData, initialStep = 1, initialDraftId }: {
    children: ReactNode;
    initialData?: EventDraftData;
    initialStep?: number;
    initialDraftId?: string;
}) {
    const [step, setStep] = useState(initialStep);
    const [data, setData] = useState<EventDraftData>(initialData || { step: 1 });
    const [draftId, setDraftId] = useState<string | undefined>(initialDraftId);
    const [isSaving, setIsSaving] = useState(false);

    const updateData = (newData: Partial<EventDraftData>) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    const saveDraft = async () => {
        setIsSaving(true);
        try {
            const currentStep = step;
            // Ensure data has current step
            const payload = { ...data, step: currentStep };

            const result = await saveEventDraft(draftId, payload, currentStep);

            if (result.success && result.draftId) {
                setDraftId(result.draftId);
                toast.success("Draft saved");
            } else {
                toast.error("Failed to save draft");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error saving draft");
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save on specific triggers? Maybe just manual for now or on Next step.

    return (
        <WizardContext.Provider value={{ step, setStep, data, updateData, saveDraft, isSaving, draftId, setDraftId }}>
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (!context) throw new Error("useWizard must be used within WizardProvider");
    return context;
}
