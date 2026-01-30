"use client";

import { toggleVendorStatus } from "@/app/actions/vendor";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface VendorStatusToggleProps {
    vendorId: string;
    currentStatus: string;
}

export function VendorStatusToggle({ vendorId, currentStatus }: VendorStatusToggleProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        const newStatus = currentStatus === 'VERIFIED' ? 'PENDING' : 'VERIFIED';

        startTransition(async () => {
            const result = await toggleVendorStatus(vendorId, newStatus);
            if (result.success) {
                toast.success(`Vendor ${newStatus.toLowerCase()} successfully`);
            } else {
                toast.error("Failed to update status");
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            disabled={isPending}
            title={currentStatus === 'VERIFIED' ? "Revoke Verification" : "Verify Vendor"}
        >
            {currentStatus === 'VERIFIED' ? (
                <XCircle className="h-4 w-4 text-red-500" />
            ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
            )}
        </Button>
    );
}
