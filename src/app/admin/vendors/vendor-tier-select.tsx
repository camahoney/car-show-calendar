"use client";

import { updateVendorTier } from "@/app/actions/vendor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VendorTierSelectProps {
    vendorId: string;
    currentTier: string;
}

export function VendorTierSelect({ vendorId, currentTier }: VendorTierSelectProps) {
    const [isPending, startTransition] = useTransition();

    const handleValueChange = (value: string) => {
        startTransition(async () => {
            const result = await updateVendorTier(vendorId, value);
            if (result.success) {
                toast.success(`Vendor tier updated to ${value}`);
            } else {
                toast.error("Failed to update tier");
            }
        });
    };

    return (
        <Select
            defaultValue={currentTier}
            onValueChange={handleValueChange}
            disabled={isPending}
        >
            <SelectTrigger className={cn(
                "w-[100px] h-8 text-xs font-medium border-white/10",
                currentTier === "PRO" ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50" : "bg-white/5 text-muted-foreground"
            )}>
                <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="PRO">PRO</SelectItem>
            </SelectContent>
        </Select>
    );
}
