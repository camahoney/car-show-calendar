import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface RecentActivityProps {
    users: any[];
    events: any[];
}

export function RecentActivityList({ users, events }: RecentActivityProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="font-heading font-bold text-lg mb-4 text-white">Recent Registrations</h3>
                <div className="space-y-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9 border border-white/10">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="bg-primary/20 text-primary uppercase text-xs">
                                    {user.name?.substring(0, 2) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && <p className="text-sm text-muted-foreground">No recent users.</p>}
                </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="font-heading font-bold text-lg mb-4 text-white">Recent Event Submissions</h3>
                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center h-9 w-9 rounded-full bg-white/5 border border-white/10">
                                <span className={`h-2 w-2 rounded-full ${event.status === 'PUBLISHED' ? 'bg-green-500' : event.status === 'PENDING_REVIEW' ? 'bg-orange-500' : 'bg-gray-500'}`} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none text-white truncate max-w-[180px]">{event.title}</p>
                                <p className="text-xs text-muted-foreground">{event.organizer?.organizationName || "Unknown Org"}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant={event.status === 'PUBLISHED' ? "outline" : "secondary"} className="text-[10px] h-5">
                                    {event.status}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(event.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && <p className="text-sm text-muted-foreground">No recent events.</p>}
                </div>
            </div>
        </div>
    );
}
