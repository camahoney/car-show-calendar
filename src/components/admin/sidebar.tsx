"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShieldAlert,
    Users,
    CalendarDays,
    Settings,
    ChevronRight,
    FileText,
    CheckCircle,
    UploadCloud
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    {
        title: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Event Moderation",
        href: "/admin/events",
        icon: ShieldAlert,
    },
    {
        title: "Verifications",
        href: "/admin/verifications",
        icon: CheckCircle,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: FileText,
    },
    {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Import Events",
        href: "/admin/import",
        icon: UploadCloud,
    },
    {
        title: "All Events",
        href: "/admin/all-events",
        icon: CalendarDays,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-20 bottom-0 w-64 border-r border-white/10 bg-background/50 backdrop-blur-xl hidden lg:block z-30">
            <div className="flex h-full flex-col py-6">
                <div className="px-6 mb-8">
                    <h2 className="text-xl font-heading font-bold tracking-wide flex items-center gap-2 text-primary">
                        <ShieldAlert className="h-6 w-6" />
                        ADMIN PANEL
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">System Control</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 group overflow-hidden",
                                    isActive
                                        ? "text-white"
                                        : "text-muted-foreground hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeAdminNav"
                                        className="absolute inset-0 bg-primary/10 border-r-2 border-primary"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}

                                <item.icon className={cn("h-5 w-5 z-10 transition-transform duration-300 group-hover:scale-110", isActive && "text-primary")} />
                                <span className="z-10">{item.title}</span>

                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="ml-auto z-10"
                                    >
                                        <ChevronRight className="h-4 w-4 text-primary" />
                                    </motion.div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="px-6 mt-auto">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5">
                        <p className="text-xs font-medium text-white mb-1">Status: Operational</p>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] text-muted-foreground">System Healthy</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
