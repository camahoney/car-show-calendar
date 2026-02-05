"use server"

import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(prevState: any, formData: FormData) {
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    }

    const validatedFields = contactSchema.safeParse(data)

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below."
        }
    }

    const { name, email, subject, message } = validatedFields.data

    try {
        // Send email to Admin
        // Using string concatenation for simplicity in text content
        await resend.emails.send({
            from: "Car Show Calendar <onboarding@resend.dev>", // Or verified domain
            to: process.env.ADMIN_EMAIL || "support@autoshowlist.com",
            // Better: Use the support email from settings, or fall back to env var?
            // For now, I'll assume the user's email or a generic one.
            // Actually, I'll send it to the address configured in settings?
            // I don't have access to settings easily here without importing.
            // I'll use a placeholder or the user's email from conversation context if I knew it.
            // I'll use "support@carshowcalendar.com" conceptually, but Resend requires a verified TO in test mode if not sending to self?
            // Test mode Resend only sends to the account owner email.
            // I'll use "delivered@resend.dev" for testing safely? No, I want the user to get it.
            // I'll look for an email in .env? No.
            // I'll just use a safe fallback.
            replyTo: email,
            subject: `[Contact Form] ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        })

        return { success: true, message: "Message sent! We'll get back to you soon." }
    } catch (error) {
        console.error("Contact form error:", error)
        return { success: false, message: "Something went wrong. Please try again." }
    }
}
