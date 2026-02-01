"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importEvents } from "@/app/actions/admin-import";
import { searchEvents, extractEventDetails } from "@/app/actions/scraper";
import { toast } from "sonner";
import { Loader2, Search, Plus, ExternalLink, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/event-form";

export default function ImportPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-2">Event Discovery & Import</h1>
            <p className="text-muted-foreground mb-8">Find new events using AI or bulk import JSON.</p>

            <Tabs defaultValue="scraper">
                <TabsList className="mb-4">
                    <TabsTrigger value="scraper">AI Scraper</TabsTrigger>
                    <TabsTrigger value="json">JSON Import</TabsTrigger>
                </TabsList>

                <TabsContent value="scraper">
                    <ScraperView />
                </TabsContent>

                <TabsContent value="json">
                    <JsonImportView />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ScraperView() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    async function handleSearch() {
        if (!query.trim()) return;
        setLoading(true);
        setResults([]);

        try {
            const res = await searchEvents(query);
            if (res.success && res.data) {
                setResults(res.data);
                if (res.data.length === 0) toast.info("No results found.");
            } else {
                toast.error(res.error || "Search failed");
            }
        } catch (e) {
            toast.error("Search error");
        } finally {
            setLoading(false);
        }
    }

    async function handleAnalyze(url: string, id: string) {
        setAnalyzingId(id);
        try {
            const res = await extractEventDetails(url);
            if (res.success && res.data) {
                // Pre-fill form data
                // Pre-fill form data
                const d = res.data;

                // Helper to format ISO date to datetime-local (YYYY-MM-DDTHH:mm)
                const toLocal = (iso: string) => iso ? iso.slice(0, 16) : "";

                setExtractedData({
                    title: d.title || "",
                    description: d.description || "",
                    venueName: d.venue || d.location || "",
                    addressLine1: d.address || "",
                    city: d.city || "",
                    state: d.state || "",
                    zip: d.zip || "",
                    startDateTime: toLocal(d.start_date),
                    endDateTime: toLocal(d.end_date),
                    websiteUrl: d.website || url,
                    isPreRelease: false,
                    source: "SCRAPER", // Flag for badge
                });
                setIsDialogOpen(true);
            } else {
                toast.error(res.error || "Extraction failed");
            }
        } catch (e) {
            toast.error("Analysis error");
        } finally {
            setAnalyzingId(null);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Smart Search</CardTitle>
                    <CardDescription>Enter a location and month (e.g., "Car shows in St LLC March 2026")</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Input
                        placeholder="Search query..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Scan
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
                {results.map((item: any) => (
                    <Card key={item.url || item.title} className="hover:bg-accent/5 transition-colors">
                        <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                            <div>
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                                <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" /> {item.url}
                                </a>
                            </div>
                            <Button
                                variant="secondary"
                                disabled={analyzingId === item.url}
                                onClick={() => handleAnalyze(item.url, item.url)}
                            >
                                {analyzingId === item.url ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="mr-2 h-4 w-4" />
                                )}
                                Analyze & Add
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Review & Save Event</h2>
                    {extractedData && (
                        <EventForm initialData={extractedData} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function JsonImportView() {
    const [jsonInput, setJsonInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    async function handleImport() {
        if (!jsonInput.trim()) return;

        setLoading(true);
        setResults([]);
        const result = await importEvents(jsonInput);
        setLoading(false);

        if (result.success && result.results) {
            setResults(result.results);
            const successCount = result.results.filter((r: any) => r.success).length;
            toast.success(`Processed ${result.results.length} items. ${successCount} imported.`);
            if (successCount === result.results.length) setJsonInput("");
        } else {
            toast.error(result.error || "Failed to import events");
        }
    }

    return (
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

                {results.length > 0 && (
                    <div className="mt-4 space-y-2 border-t pt-4">
                        <h3 className="font-bold">Results:</h3>
                        <ul className="text-sm space-y-1">
                            {results.map((res, i) => (
                                <li key={i} className={res.success ? "text-green-500" : "text-red-500"}>
                                    {res.success ? "✅" : "❌"} <strong>{res.name}</strong>: {res.loc || res.error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
