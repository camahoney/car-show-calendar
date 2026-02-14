"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EventActionMenu from "./EventActionMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteEvents } from "@/app/actions/event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Event {
    id: string;
    title: string;
    city: string;
    state: string;
    posterUrl: string;
    status: string;
    tier: string;
    startDateTime: Date;
    organizer: {
        organizerName: string;
    };
}

interface EventsDataTableProps {
    events: Event[];
}

export function EventsDataTable({ events }: EventsDataTableProps) {
    const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const toggleSelectAll = () => {
        if (selectedEvents.size === events.length) {
            setSelectedEvents(new Set());
        } else {
            setSelectedEvents(new Set(events.map(e => e.id)));
        }
    };

    const toggleSelectEvent = (id: string) => {
        const newSelected = new Set(selectedEvents);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedEvents(newSelected);
    };

    const handleDeleteSelected = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedEvents.size} events? This cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteEvents(Array.from(selectedEvents));
            if (result.success) {
                toast.success(`Successfully deleted ${result.count} events`);
                setSelectedEvents(new Set());
                router.refresh();
            } else {
                toast.error("Failed to delete events");
            }
        } catch (error) {
            toast.error("An error occurred while deleting events");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            {selectedEvents.size > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center justify-between">
                    <span className="text-red-400 font-bold">{selectedEvents.size} events selected</span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : `Delete Selected (${selectedEvents.size})`}
                    </Button>
                </div>
            )}

            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-white/5 border-b border-white/10">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={events.length > 0 && selectedEvents.size === events.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="text-white font-bold w-[300px]">Event</TableHead>
                            <TableHead className="text-white font-bold">Organizer</TableHead>
                            <TableHead className="text-white font-bold">Status</TableHead>
                            <TableHead className="text-white font-bold">Tier</TableHead>
                            <TableHead className="text-white font-bold">Date</TableHead>
                            <TableHead className="text-white font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedEvents.has(event.id)}
                                        onCheckedChange={() => toggleSelectEvent(event.id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                            <Image src={event.posterUrl || "/placeholder.png"} alt="" fill className="object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white line-clamp-1">{event.title}</div>
                                            <div className="text-xs text-muted-foreground">{event.city}, {event.state}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {event.organizer.organizerName}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`border-white/10 ${event.status === 'APPROVED' ? 'text-green-400 bg-green-400/10' :
                                        event.status === 'DRAFT' ? 'text-gray-400' :
                                            event.status === 'SUBMITTED' ? 'text-orange-400 bg-orange-400/10' :
                                                'text-red-400 bg-red-400/10'
                                        }`}>
                                        {event.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-xs">
                                        {event.tier}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {format(new Date(event.startDateTime), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-white" asChild>
                                            <Link href={`/events/${event.id}`} target="_blank">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-blue-400" asChild>
                                            <Link href={`/admin/events/${event.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <EventActionMenu
                                            eventId={event.id}
                                            currentStatus={event.status}
                                            eventTitle={event.title}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
