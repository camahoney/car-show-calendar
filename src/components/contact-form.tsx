"use client"

import { useActionState } from "react"
import { submitContactForm } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"

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
                    className="bg-black/20 border-white/10"
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
                    className="bg-black/20 border-white/10"
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
                    className="bg-black/20 border-white/10"
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
                    className="min-h-[150px] bg-black/20 border-white/10"
                />
                {state.errors?.message && <p className="text-red-500 text-xs">{state.errors.message[0]}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
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
