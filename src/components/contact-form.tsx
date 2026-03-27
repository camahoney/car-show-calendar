"use client"

import { useActionState } from "react"
import { submitContactForm } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { useEffect, useState } from "react"

const initialState = {
    success: false,
    message: "",
    errors: {} as Record<string, string[]>
}

export function ContactForm() {
    // @ts-ignore - useActionState types can be tricky
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

    if (state.success) {
        return (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                <div className="bg-primary/20 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">{state.message}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Send Another Message
                </Button>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-6">
            {/* Honeypot field - invisible to humans, filled by bots */}
            <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {/* Timestamp for timing check */}
            <input type="hidden" name="_loaded" value={Date.now()} />

            {state.message && !state.success && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {state.message}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="bg-black/40 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-colors text-white placeholder:text-muted-foreground/50 h-12"
                />
                {state.errors?.name && <p className="text-red-500 text-xs">{state.errors.name[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="bg-black/40 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-colors text-white placeholder:text-muted-foreground/50 h-12"
                />
                {state.errors?.email && <p className="text-red-500 text-xs">{state.errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    required
                    className="bg-black/40 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-colors text-white placeholder:text-muted-foreground/50 h-12"
                />
                {state.errors?.subject && <p className="text-red-500 text-xs">{state.errors.subject[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more..."
                    required
                    className="min-h-[160px] bg-black/40 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-colors text-white placeholder:text-muted-foreground/50"
                />
                {state.errors?.message && <p className="text-red-500 text-xs">{state.errors.message[0]}</p>}
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-primary/50 transition-all rounded-xl" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                    </>
                ) : (
                    "Send Message"
                )}
            </Button>
        </form>
    )
}
