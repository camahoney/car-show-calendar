"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateSystemSettings } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    featuredEventPrice: z.coerce.number().min(0),
    standardEventPrice: z.coerce.number().min(0),
    featuredEventDurationDays: z.coerce.number().int().min(1),
    enableRegistration: z.boolean(),
    maintenanceMode: z.boolean(),
    supportEmail: z.string().optional(),
})

type SettingsFormProps = {
    initialData: z.infer<typeof formSchema> & { id: string }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            featuredEventPrice: initialData.featuredEventPrice,
            standardEventPrice: initialData.standardEventPrice,
            featuredEventDurationDays: initialData.featuredEventDurationDays,
            enableRegistration: initialData.enableRegistration,
            maintenanceMode: initialData.maintenanceMode,
            supportEmail: initialData.supportEmail || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true)
        try {
            const result = await updateSystemSettings(values)
            if (result.success) {
                toast.success("Settings updated successfully")
                router.refresh()
            } else {
                toast.error("Failed to update settings")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white/5 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Monetization</CardTitle>
                        <CardDescription className="text-gray-400">Configure event pricing and durations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="featuredEventPrice">Featured Event Price ($)</Label>
                            <Input
                                id="featuredEventPrice"
                                step="0.01"
                                type="number"
                                className="bg-black/50 border-white/10"
                                {...form.register("featuredEventPrice")}
                            />
                            <p className="text-xs text-gray-500">
                                This price will be used for Stripe checkout sessions.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="standardEventPrice">Standard Event Price ($)</Label>
                            <Input
                                id="standardEventPrice"
                                step="0.01"
                                type="number"
                                className="bg-black/50 border-white/10"
                                {...form.register("standardEventPrice")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="featuredEventDurationDays">Featured Duration (Days)</Label>
                            <Input
                                id="featuredEventDurationDays"
                                type="number"
                                className="bg-black/50 border-white/10"
                                {...form.register("featuredEventDurationDays")}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>System Controls</CardTitle>
                        <CardDescription className="text-gray-400">Manage global site availability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label className="text-base">Enable Registration</Label>
                                <p className="text-sm text-gray-400">
                                    Allow new users to sign up.
                                </p>
                            </div>
                            <Switch
                                checked={form.watch("enableRegistration")}
                                onCheckedChange={(checked: boolean) => form.setValue("enableRegistration", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label className="text-base text-red-400">Maintenance Mode</Label>
                                <p className="text-sm text-gray-400">
                                    Disable public access to the site (Admin only).
                                </p>
                            </div>
                            <Switch
                                checked={form.watch("maintenanceMode")}
                                onCheckedChange={(checked: boolean) => form.setValue("maintenanceMode", checked)}
                            />
                        </div>
                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <Label htmlFor="supportEmail">Support Email</Label>
                            <Input
                                id="supportEmail"
                                placeholder="support@example.com"
                                className="bg-black/50 border-white/10"
                                {...form.register("supportEmail")}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white min-w-[120px]">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
