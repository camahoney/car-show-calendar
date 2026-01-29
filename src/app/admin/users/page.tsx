import { prisma } from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100 // Pagination later if needed
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-heading font-bold text-white tracking-tight">User Management</h1>
                <p className="text-muted-foreground">View and manage registered users.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-white/5 border-b border-white/10">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="text-white font-bold">User</TableHead>
                            <TableHead className="text-white font-bold">Role</TableHead>
                            <TableHead className="text-white font-bold">Joined</TableHead>
                            {/* <TableHead className="text-white font-bold text-right">Actions</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarImage src={user.image || ""} />
                                            <AvatarFallback className="bg-primary/20 text-primary">{user.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`border-white/10 ${user.role === 'ADMIN' ? 'text-red-400 bg-red-400/10' :
                                            user.role === 'ORGANIZER' ? 'text-blue-400 bg-blue-400/10' :
                                                'text-muted-foreground'
                                        }`}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                                </TableCell>
                                {/* <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
