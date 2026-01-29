import { prisma } from "@/lib/prisma";
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

export const dynamic = 'force-dynamic';

export default async function AdminAllEventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        include: { organizer: true },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">All Events</h1>
                    <p className="text-muted-foreground">Master list of all scheduled events.</p>
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-white/5 border-b border-white/10">
                        <TableRow className="hover:bg-transparent border-white/10">
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
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                            <Image src={event.posterUrl} alt="" fill className="object-cover" />
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
                                        {/* Future: Add Edit/Delete actions here */}
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
