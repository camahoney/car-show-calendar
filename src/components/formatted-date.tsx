"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface FormattedDateProps {
    date: Date | string | number;
    dateFormat?: string;
    className?: string;
}

export function FormattedDate({ date, dateFormat = "h:mm a", className }: FormattedDateProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Skeleton className="h-4 w-20 inline-block" />;
    }

    return <span className={className}>{format(new Date(date), dateFormat)}</span>;
}
