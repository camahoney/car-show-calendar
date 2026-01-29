"use client";

import { useEffect } from "react";
import { incrementView } from "@/app/actions/analytics";

export function ViewTracker({ eventId }: { eventId: string }) {
    useEffect(() => {
        // Increment view count on mount
        incrementView(eventId);
    }, [eventId]);

    return null;
}
