"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createFeaturedUpgradeSession } from "@/app/actions/stripe";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function UpgradeEventButton({ eventId }: { eventId: string }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleUpgrade = () => {
        startTransition(async () => {
            try {
                await createFeaturedUpgradeSession(eventId);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Failed to start checkout. Try again.",
                    variant: "destructive",
                });
            }
        });
    };

    return (
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-4 rounded-xl border border-yellow-500/20 flex items-center justify-between gap-4">
            <div>
                <h4 className="font-bold text-yellow-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Boost this Event
                </h4>
                <p className="text-sm text-muted-foreground">
                    Get 30 days of Featured placement & home page visibility.
                </p>
            </div>
            <Button
                onClick={handleUpgrade}
                disabled={isPending}
                className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold"
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Upgrade ($19)
            </Button>
        </div>
    );
}
