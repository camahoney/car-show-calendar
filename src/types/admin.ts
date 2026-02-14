export interface RecentUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    createdAt: Date;
}

export interface RecentEvent {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    organizer: {
        organizerName: string;
    } | null;
}
