import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";

export default async function MyEventsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const events = await prisma.event.findMany({
        where: {
            organizerId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">My Events</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/events/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No events found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/events/${event.id}`} className="hover:underline">
                                            {event.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{new Date(event.startDateTime).toLocaleDateString()}</TableCell>
                                    <TableCell>{event.city}, {event.state}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={event.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/events/${event.id}/edit`}>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
