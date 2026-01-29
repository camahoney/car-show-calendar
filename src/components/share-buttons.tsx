"use client";

import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon, Facebook, Twitter, Instagram } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; // Assuming sonner is installed or will use alert for now if not

interface ShareButtonsProps {
    event: {
        id: string;
        title: string;
    };
}

export function ShareButtons({ event }: ShareButtonsProps) {
    const shareUrl = typeof window !== "undefined" ? window.location.href : `https://car-show-calendar.vercel.app/events/${event.id}`;

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        // basic alert if no toast
        alert("Link copied to clipboard!");
    };

    const shareFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            "_blank"
        );
    };

    const shareTwitter = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Check out ${event.title} on Car Show Calendar!`
            )}&url=${encodeURIComponent(shareUrl)}`,
            "_blank"
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Event
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass bg-black/90 border-white/10 text-white">
                <DropdownMenuItem onClick={copyLink} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareFacebook} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    <Facebook className="mr-2 h-4 w-4" /> Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareTwitter} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    <Twitter className="mr-2 h-4 w-4" /> X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyLink} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    <Instagram className="mr-2 h-4 w-4" /> Instagram (Copy Link)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
