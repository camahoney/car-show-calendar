"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { approveEvent, rejectEvent } from "@/app/actions/admin";
import { toast } from "sonner";

export function PendingEventActions({ eventId }: { eventId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const res = await approveEvent(eventId);
            if (res.success) {
                toast.success("Event Approved & Published");
            } else {
                toast.error(res.error);
            }
        } catch (e) {
            toast.error("Error approving event");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!confirm("Are you sure you want to reject this event?")) return;
        setIsLoading(true);
        try {
            const res = await rejectEvent(eventId);
            if (res.success) {
                toast.success("Event Rejected");
            } else {
                toast.error(res.error);
            }
        } catch (e) {
            toast.error("Error rejecting event");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full md:w-32">
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 w-full"
                onClick={handleApprove}
                disabled={isLoading}
            >
                <Check className="w-4 h-4 mr-1" /> Approve
            </Button>
            <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={handleReject}
                disabled={isLoading}
            >
                <X className="w-4 h-4 mr-1" /> Reject
            </Button>
        </div>
    );
}
