"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { importEvents } from "@/app/actions/admin-import";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ImportPage() {
    const [jsonInput, setJsonInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleImport() {
        if (!jsonInput.trim()) return;

        setLoading(true);
        const result = await importEvents(jsonInput);
        setLoading(false);

        if (result.success) {
            toast.success(`Successfully imported ${result.count} events!`);
            setJsonInput("");
        } else {
            toast.error(result.error || "Failed to import events");
        }
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Bulk Event Import</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Paste JSON Here</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder='[{"event_name": "...", ...}]'
                        className="min-h-[400px] font-mono text-sm"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                    />
                    <Button onClick={handleImport} disabled={loading} className="w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import Events
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
