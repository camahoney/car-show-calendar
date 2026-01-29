"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon, Download } from "lucide-react";

interface AddToCalendarProps {
    event: {
        title: string;
        description: string;
        startDateTime: Date | string;
        endDateTime: Date | string;
        venueName: string;
        address: string;
    };
}

export function AddToCalendar({ event }: AddToCalendarProps) {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const location = `${event.venueName}, ${event.address}`;

    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        event.title
    )}&dates=${start.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${end
        .toISOString()
        .replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(
            event.description
        )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    const downloadIcs = () => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CarShowCalendar//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@carshowcalendar.com
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}
DTSTART:${start.toISOString().replace(/-|:|\.\d\d\d/g, "")}
DTEND:${end.toISOString().replace(/-|:|\.\d\d\d/g, "")}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto glass border-white/10 hover:bg-white/10">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    Add to Calendar
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass bg-black/90 border-white/10 text-white">
                <DropdownMenuItem onClick={() => window.open(googleUrl, "_blank")} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    Google Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadIcs} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    <Download className="mr-2 h-3 w-3" />
                    Download .ICS (Apple/Outlook)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
