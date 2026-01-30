"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
    targetDate: Date | string;
    className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const target = new Date(targetDate).getTime();
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                setIsExpired(true);
                setTimeLeft("Expired");
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            // const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (days > 7) {
                // If more than a week, maybe just don't show or show days
                setTimeLeft(`${days} days`);
            } else if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`);
            } else {
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 60000); // Update every minute to save resources

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!timeLeft || isExpired) return null;

    return (
        <div className={cn("flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-red-500/50 shadow-sm", className)}>
            <Clock className="w-3 h-3 text-red-500 animate-pulse" />
            <span className="text-red-100">Expires in {timeLeft}</span>
        </div>
    );
}
