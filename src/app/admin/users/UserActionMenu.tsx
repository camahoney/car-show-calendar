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
import { MoreHorizontal, Shield, Trash2, Crown, User as UserIcon } from "lucide-react";
import { updateUserRole, deleteUser, promoteUserToPro } from "./actions";
import { toast } from "sonner";

interface UserActionMenuProps {
    userId: string;
    currentRole: string;
    userName: string;
}

export default function UserActionMenu({ userId, currentRole, userName }: UserActionMenuProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = async (newRole: string) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("role", newRole);
            await updateUserRole(formData);
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            toast.error("Failed to update role");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            await deleteUser(formData);
            toast.success("User deleted successfully");
            setIsDeleteDialogOpen(false);
        } catch (error) {
            toast.error("Failed to delete user");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromote = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            await promoteUserToPro(formData);
            toast.success("User promoted to PRO");
        } catch (error) {
            toast.error("Failed to promote user");
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
                        onClick={() => navigator.clipboard.writeText(userId)}
                    >
                        Copy User ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleRoleChange("USER")} disabled={currentRole === "USER" || isLoading}>
                        <UserIcon className="mr-2 h-4 w-4" /> User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange("ORGANIZER")} disabled={currentRole === "ORGANIZER" || isLoading}>
                        <Shield className="mr-2 h-4 w-4" /> Organizer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")} disabled={currentRole === "ADMIN" || isLoading}>
                        <Shield className="mr-2 h-4 w-4 text-red-500" /> Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handlePromote} disabled={isLoading} className="text-orange-400">
                        <Crown className="mr-2 h-4 w-4" /> Promote to PRO
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone and will remove all their data permanently.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-white/10">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
