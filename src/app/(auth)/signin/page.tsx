"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Shield, Facebook, Twitter } from "lucide-react";
import { Suspense, useState } from "react";
import { Loader2, Mail, Lock, ArrowRight, User, LayoutDashboard, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SignInForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [loading, setLoading] = useState<string | null>(null);
    const [email, setEmail] = useState("");

    const handleGoogleLogin = async () => {
        try {
            setLoading("google");
            const result = await signIn("google", {
                callbackUrl,
                redirect: false, // Handle redirect manually to catch errors
            });

            if (result?.error) {
                setLoading(null);
                console.error("Google Sign In Error:", result.error);
                // Optionally show toast error here
            } else if (result?.url) {
                window.location.href = result.url; // Manual redirect
            } else {
                setLoading(null);
            }
        } catch (error) {
            console.error("Login exception:", error);
            setLoading(null);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        try {
            setLoading("email");
            const result = await signIn("email", {
                email,
                callbackUrl,
                redirect: false
            });

            if (result?.error) {
                setLoading(null);
                alert("Error sending magic link. Please try again.");
            } else {
                // Success - usually NextAuth stays on page or shows "Check your email"
                // We can show a state here
                alert("Magic link sent! Check your email.");
                setLoading(null);
            }
        } catch (error) {
            setLoading(null);
        }
    };

    const handleDemoLogin = async (role: "user" | "organizer") => {
        try {
            setLoading(role);
            const email = role === "organizer" ? "organizer@example.com" : "user@example.com";
            const result = await signIn("credentials", {
                email,
                callbackUrl: '/dashboard',
                redirect: false
            });

            if (result?.error) {
                setLoading(null);
            } else if (result?.url) {
                window.location.href = result.url;
            }
        } catch (error) {
            setLoading(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <div className="glass p-8 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to access your dashboard</p>
                </div>

                <div className="space-y-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium relative group overflow-hidden"
                        onClick={handleGoogleLogin}
                        disabled={!!loading}
                    >
                        {loading === "google" ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.17c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.54z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        )}
                        Continue with Google
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="w-full bg-white/5 border-white/10 hover:bg-[#1877F2]/20 hover:text-[#1877F2] hover:border-[#1877F2]/50 text-white"
                            onClick={() => signIn("facebook", { callbackUrl })}
                            disabled={!!loading}
                        >
                            {loading === "facebook" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Facebook className="mr-2 h-4 w-4" />}
                            Facebook
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full bg-white/5 border-white/10 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 text-white"
                            onClick={() => signIn("twitter", { callbackUrl })}
                            disabled={!!loading}
                        >
                            {loading === "twitter" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Twitter className="mr-2 h-4 w-4" />}
                            Twitter
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 text-xs uppercase text-muted-foreground font-medium">
                        <div className="flex-1 h-px bg-white/10" />
                        Or with email
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10 h-12 bg-black/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-muted-foreground/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={!!loading}
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                            disabled={!!loading}
                        >
                            {loading === "email" ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ArrowRight className="mr-2 h-5 w-5" />}
                            Send Magic Link
                        </Button>
                    </form>
                </div>

                {/* Demo Logins */}
                <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                    <p className="text-xs text-center text-muted-foreground mb-3">Instant Demo Access (No Email Required)</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 hover:bg-white/5 hover:text-primary hover:border-primary/50 transition-colors"
                            onClick={() => handleDemoLogin("user")}
                            disabled={!!loading}
                        >
                            <User className="mr-2 h-4 w-4" /> User
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 hover:bg-white/5 hover:text-primary hover:border-primary/50 transition-colors"
                            onClick={() => handleDemoLogin("organizer")}
                            disabled={!!loading}
                        >
                            <Calendar className="mr-2 h-4 w-4" /> Organizer
                        </Button>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
                By clicking continue, you agree to our <Link href="/terms" className="underline hover:text-white">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
            </p>
        </motion.div>
    );
}

export default function SignInPage() {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-[#020817] z-0" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-[#020817] to-[#020817] z-0 opacity-40" />
            <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1493238792015-8098a281faf6?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-overlay z-0" />

            <div className="relative z-10 w-full flex justify-center">
                <Suspense fallback={<div className="text-white">Loading interface...</div>}>
                    <SignInForm />
                </Suspense>
            </div>
        </div>
    );
}
