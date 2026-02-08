"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const routes = [
        { href: "/pricing", label: "Pricing" },
        { href: "/events", label: "Events" },
        { href: "/map", label: "Map" },
        { href: "/vendors", label: "Vendors" },
    ];

    return (
        <header className="fixed top-0 w-full z-50 glass border-b border-white/5 shadow-2xl shadow-black/50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <div className="relative h-20 w-80 -ml-4 md:-ml-0">
                        <Image
                            src="/logo-wide.png"
                            alt="AutoShowList"
                            fill
                            className="object-contain object-left md:object-center drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav - Centered */}
                <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium px-4 py-2 rounded-full transition-all hover:bg-white/10 hover:text-white",
                                pathname === route.href
                                    ? "text-white bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                    : "text-muted-foreground"
                            )}
                        >
                            {route.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <UserMenu />
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold" asChild>
                        <Link href="/events/new">Post Event</Link>
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden glass border-b border-white/5 absolute w-full p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                                "text-sm font-medium p-2 rounded-md hover:bg-white/5 transition-colors",
                                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                            )}
                        >
                            {route.label}
                        </Link>
                    ))}
                    <div className="h-px bg-white/5 my-2" />
                    <Button className="w-full bg-primary font-bold" asChild>
                        <Link href="/events/new">Post Event</Link>
                    </Button>
                </div>
            )}
        </header>
    );
}

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";

function UserMenu() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />;
    }

    if (status === "unauthenticated" || !session) {
        return (
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-white mr-2">
                <Link href="/signin">Sign In</Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {session.user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                {session.user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Admin Panel
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
