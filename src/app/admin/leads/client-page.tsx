"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Globe, Rss, Play } from "lucide-react";
import {
    runScanAction,
    getLeads,
    updateLeadStatus,
    getScanSources,
    addScanSource,
    deleteScanSource,
    getScanHistory
} from "@/app/actions/leads";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

// Types
type Lead = {
    id: string;
    type: string;
    title: string;
    summary: string | null;
    score: number;
    status: string;
    sourceName: string;
    sourceUrl: string;
    eventDate: Date | null;
    city: string | null;
    state: string | null;
    contactHints: any;
    confidence: number;
};

type ScanSource = {
    id: string;
    name: string;
    type: string;
    config: any;
    enabled: boolean;
};

export default function LeadFinderClient({
    initialLeads,
    initialSources,
    initialHistory = []
}: {
    initialLeads: Lead[],
    initialSources: ScanSource[],
    initialHistory?: any[]
}) {
    const [scanning, setScanning] = useState(false);
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    // Explicitly casting initialSources to any[] or ScanSource[] to match state if needed, but TS should handle it
    const [sources, setSources] = useState<ScanSource[]>(initialSources);
    const [history, setHistory] = useState<any[]>(initialHistory);
    const [loadingData, setLoadingData] = useState(false);
    const [leadsFilter, setLeadsFilter] = useState<'NEW' | 'REVIEWED' | 'ALL'>('NEW');

    // Refresh Data function
    const refreshData = async () => {
        setLoadingData(true);
        try {
            // Note: getLeads returns Promise<Lead[]>
            const [l, s, h] = await Promise.all([
                getLeads(leadsFilter),
                getScanSources(),
                getScanHistory()
            ]);
            setLeads(l as any);
            setSources(s as any);
            setHistory(h as any);
        } catch (e) {
            console.error("Refresh error:", e);
        } finally {
            setLoadingData(false);
        }
    };

    // Effect for filter changes
    useEffect(() => {
        // Skip initial load if we have data, unless filter changed
        // For simplicity, just refresh on filter change
        if (leadsFilter !== 'NEW') { // Assuming initial is NEW
            refreshData();
        }
    }, [leadsFilter]);

    const handleScan = async () => {
        setScanning(true);
        toast.info("Scan started... this may take a minute.");
        try {
            const res = await runScanAction();
            if (res.success) {
                toast.success(`Scan complete! Found ${res.leadsCreated} new leads.`);
                refreshData();
            } else {
                toast.error("Scan finished with errors. Check logs.");
            }
        } catch (e: any) {
            toast.error(e.message || "Scan failed.");
        } finally {
            setScanning(false);
        }
    };

    const handleAddSource = async (formData: FormData) => {
        // formData not used directly with new handler signature, but kept for compat if needed
        // See AddSourceDialog implementation below
    };

    // Wrapper for AddSourceDialog
    const onAddSource = async (fd: FormData) => {
        const name = fd.get('name') as string;
        const type = fd.get('type') as 'RSS' | 'URL';
        const url = fd.get('url') as string;

        if (!name || !url) return;

        const result = await addScanSource(name, type, url);
        if (!result.success) {
            throw new Error(result.error || "Failed to add source");
        }
        toast.success("Source added");
        refreshData();
    };

    const handleDeleteSource = async (id: string) => {
        await deleteScanSource(id);
        toast.success("Source deleted");
        refreshData();
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        await updateLeadStatus(id, newStatus);
        setLeads(prev => prev.filter(l => l.id !== id));
        toast.success("Lead updated");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Lead Finder</h2>
                    <p className="text-muted-foreground">Automated prospecting for events and vendors.</p>
                </div>
                <Button onClick={handleScan} disabled={scanning} size="lg" className="gap-2">
                    {scanning ? <Loader2 className="animate-spin" /> : <Play className="fill-current" />}
                    {scanning ? "Scanning..." : "Run AI Scan"}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* SOURCE MANAGER */}
                <Card className="md:col-span-4 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex justify-between items-center">
                            Sources
                            <AddSourceDialog onAdd={onAddSource} />
                        </CardTitle>
                        <CardDescription>Public feeds & URLs to monitor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-3">
                                {sources.map(source => (
                                    <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {source.type === 'RSS' ? <Rss className="h-4 w-4 text-orange-500 shrink-0" /> : <Globe className="h-4 w-4 text-blue-500 shrink-0" />}
                                            <div className="truncate">
                                                <div className="font-medium truncate">{source.name}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{source.config.url}</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSource(source.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {sources.length === 0 && <div className="text-center text-sm text-muted-foreground py-4">No sources configured. Add one to start.</div>}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* LEAD INBOX */}
                <Card className="md:col-span-8">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Lead Inbox</CardTitle>
                            <Tabs value={leadsFilter} onValueChange={(v: any) => setLeadsFilter(v)} className="w-[300px]">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="NEW">New</TabsTrigger>
                                    <TabsTrigger value="REVIEWED">Reviewed</TabsTrigger>
                                    <TabsTrigger value="ALL">All</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loadingData ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
                        ) : (
                            <div className="space-y-4">
                                {leads.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-4">
                                        <p>No new leads found.</p>
                                        <ScanHistoryLog history={history} />
                                    </div>
                                ) : (
                                    <>
                                        <ScanHistoryLog history={history} collapsed />
                                        {leads.map(lead => (
                                            <LeadCard key={lead.id} lead={lead} onStatusUpdate={handleStatusUpdate} />
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ScanHistoryLog({ history, collapsed = false }: { history: any[], collapsed?: boolean }) {
    if (!history?.length) return null;

    return (
        <div className="w-full text-sm border rounded p-3 bg-muted/30">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
                Last Scan Results
                {collapsed && <Badge variant="outline" className="text-xs font-normal">History</Badge>}
            </h4>
            <div className="space-y-2">
                {history.slice(0, collapsed ? 1 : 3).map((run, i) => (
                    <div key={run.id || i} className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between">
                            <span className="font-medium">{new Date(run.startedAt).toLocaleString()}</span>
                            <span>Found: {run.leadsCreated} leads / {run.itemsFound} items</span>
                        </div>
                        {run.errors && Array.isArray(run.errors) && run.errors.length > 0 && (
                            <div className="text-destructive pl-2 border-l-2 border-destructive/20 mt-1">
                                {(run.errors as any[]).map((err, j) => (
                                    <div key={j} className="truncate" title={JSON.stringify(err)}>
                                        {err.message || err.error || JSON.stringify(err)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AddSourceDialog({ onAdd }: { onAdd: (fd: FormData) => void }) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("URL");
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !url) {
            toast.error("Name and URL are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('name', name);
            fd.append('type', type);
            fd.append('url', url);

            await onAdd(fd);

            setOpen(false);
            setName("");
            setUrl("");
            setType("URL");
        } catch (error: any) {
            console.error("Submission error:", error);
            // Error is handled in the wrapper but toast here just in case
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Source</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Source Name</Label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Local Car Club"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="URL">Website URL (Scrape)</SelectItem>
                                <SelectItem value="RSS">RSS Feed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://..."
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSubmitting ? "Saving..." : "Save Source"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function LeadCard({ lead, onStatusUpdate }: { lead: Lead, onStatusUpdate: (id: string, s: string) => void }) {
    return (
        <div className="border rounded-lg p-4 bg-muted/20 hover:bg-muted/40 transition-colors">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant={lead.type === 'EVENT' ? 'default' : lead.type === 'VENDOR' ? 'secondary' : 'outline'}>
                            {lead.type}
                        </Badge>
                        <span className={`text-xs font-bold ${lead.score > 70 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {Math.round(lead.score)}
                        </span>
                        <span className="text-xs text-muted-foreground flex-1 truncate">
                            via {lead.sourceName}
                        </span>
                    </div>
                    <h4 className="font-bold text-lg">{lead.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 my-2">{lead.summary || "No summary available."}</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {lead.city && <span>📍 {lead.city}, {lead.state}</span>}
                        {lead.eventDate && <span>📅 {new Date(lead.eventDate).toLocaleDateString()}</span>}
                        {lead.sourceUrl && (
                            <Link href={lead.sourceUrl} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1">
                                <Globe className="h-3 w-3" /> Source
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" variant="default" onClick={() => onStatusUpdate(lead.id, 'REVIEWED')}>
                        Review
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onStatusUpdate(lead.id, 'IGNORED')}>
                        Ignore
                    </Button>
                </div>
            </div>
        </div>
    );
}
