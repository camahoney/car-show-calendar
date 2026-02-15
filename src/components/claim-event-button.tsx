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
import { claimEvent } from "@/app/actions/event";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function ClaimEventButton({ eventId }: { eventId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleClaim() {
        setLoading(true);
        try {
            const result = await claimEvent(eventId);
            if (result.success) {
                toast.success("Event claimed successfully! You are now the organizer.");
                setOpen(false);
                router.refresh();
            } else if (result.error === "Unauthorized") {
                toast.error("Please sign in to claim this event.");
                router.push(`/signin?callbackUrl=/events/${eventId}`);
            } else if (result.error === "Subscription Required") {
                toast.error("This feature is exclusive to Premium members.");
                router.push("/pricing");
            } else {
                toast.error(result.error || "Failed to claim event");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg animate-pulse" size="lg">
                    <ShieldCheck className="mr-2 h-5 w-5" /> Claim This Event
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Claim Event Ownership</DialogTitle>
                    <DialogDescription>
                        Are you the organizer of this event? By claiming it, you will:
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        <li>Take full control of this listing.</li>
                        <li><b>Includes Standard Upgrade</b> ($29 Value).</li>
                        <li>Unlock analytics and editing features.</li>
                        <li className="text-indigo-400 font-semibold">Requires Active Subscription</li>
                    </ul>
                    <p className="text-sm font-medium text-destructive">
                        Note: Falsely claiming events may result in account suspension.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button onClick={handleClaim} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify & Claim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
