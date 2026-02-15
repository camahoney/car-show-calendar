import Link from "next/link";
import Image from "next/image";
import { Facebook } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="w-full border-t border-white/5 bg-black/50 backdrop-blur-md mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="block relative h-10 w-40">
                            <Image
                                src="/logo-wide.png"
                                alt="Car Show Calendar"
                                fill
                                className="object-contain object-left"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            The premier platform for automotive enthusiasts to discover, track, and share car shows and events.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-white">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/events" className="hover:text-primary transition-colors">Browse Events</Link></li>
                            <li><Link href="/map" className="hover:text-primary transition-colors">Event Map</Link></li>
                            <li><Link href="/vendors" className="hover:text-primary transition-colors">Vendor Directory</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-white">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-white">Connect</h3>
                        <div className="flex space-x-4">
                            <Link href="https://autoshowlist.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="https://www.tiktok.com/@autoshowlist.com?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                                <span className="sr-only">TikTok</span>
                            </Link>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} Car Show Calendar. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
