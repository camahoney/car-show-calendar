import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    let label = status;
    let customClass = "";

    switch (status) {
        case "APPROVED":
        case "PUBLISHED":
            label = "Approved";
            customClass = "bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20";
            break;
        case "PENDING_REVIEW":
        case "SUBMITTED":
        case "PENDING":
            label = "Pending Review";
            customClass = "bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25 border-yellow-500/20";
            break;
        case "REJECTED":
            label = "Rejected";
            variant = "destructive";
            break;
        case "DRAFT":
            label = "Draft";
            customClass = "bg-gray-500/15 text-gray-400 hover:bg-gray-500/25 border-gray-500/20";
            break;
        case "EXPIRED":
            label = "Expired";
            customClass = "bg-red-900/15 text-red-700 hover:bg-red-900/25 border-red-900/20";
            break;
        default:
            // Fallback for unknown statuses: capitalize and replace underscores
            label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, " ");
    }

    return (
        <Badge variant={variant} className={cn("capitalize whitespace-nowrap", customClass, className)}>
            {label}
        </Badge>
    );
}
