"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Trash2, CheckCircle, XCircle, FileText, AlertCircle } from "lucide-react";
import { updateEventStatus, deleteEvent } from "./actions";
import { toast } from "sonner";

interface EventActionMenuProps {
    eventId: string;
    currentStatus: string;
    eventTitle: string;
}

export default function EventActionMenu({ eventId, currentStatus, eventTitle }: EventActionMenuProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("eventId", eventId);
            formData.append("status", newStatus);
            await updateEventStatus(formData);
            toast.success(`Event status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("eventId", eventId);
            await deleteEvent(formData);
            toast.success("Event deleted successfully");
            setIsDeleteDialogOpen(false);
        } catch (error) {
            toast.error("Failed to delete event");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(eventId)}
                    >
                        Copy Event ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleStatusChange("APPROVED")} disabled={currentStatus === "APPROVED" || isLoading} className="text-green-500">
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("REJECTED")} disabled={currentStatus === "REJECTED" || isLoading} className="text-red-500">
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("DRAFT")} disabled={currentStatus === "DRAFT" || isLoading}>
                        <FileText className="mr-2 h-4 w-4" /> Set to Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("SUBMITTED")} disabled={currentStatus === "SUBMITTED" || isLoading} className="text-orange-400">
                        <AlertCircle className="mr-2 h-4 w-4" /> Mark Submitted
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Delete Event</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Are you sure you want to delete <strong>{eventTitle}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-white/10">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete Event"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
