"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { boostEventByVendor } from "@/app/actions/vendor";

interface VendorBoostButtonProps {
    eventId: string;
    vendorId: string;
    isBoosted: boolean;
}

export function VendorBoostButton({ eventId, vendorId, isBoosted }: VendorBoostButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleBoost = () => {
        startTransition(async () => {
            const result = await boostEventByVendor(eventId, vendorId);
            if (result.success && result.redirectUrl) {
                window.location.href = result.redirectUrl;
            } else {
                toast.error(result.error || "Failed to start boost process.");
            }
        });
    };

    if (isBoosted) {
        return (
            <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/10 flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/20">
                    <Rocket className="h-5 w-5 text-green-500" />
                </div>
                <div>
                    <h4 className="font-bold text-green-400">Boost Active</h4>
                    <p className="text-xs text-muted-foreground">Your brand is featured on this event.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
            <div className="flex gap-4 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20 h-fit">
                    <Rocket className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                    <h4 className="font-bold text-white">Promote Your Business</h4>
                    <p className="text-sm text-muted-foreground">Feature your brand on this event page for $15.</p>
                </div>
            </div>
            <Button
                onClick={handleBoost}
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                ) : (
                    "Boost Now ($15)"
                )}
            </Button>
        </div>
    );
}
