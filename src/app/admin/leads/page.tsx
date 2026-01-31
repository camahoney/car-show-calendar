"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Globe, Rss, Play, CheckCircle } from "lucide-react";
import {
    runScanAction,
    getLeads,
    updateLeadStatus,
    deleteLead,
    getScanSources,
    addScanSource,
    deleteScanSource,
    toggleScanSource
} from "@/app/actions/leads";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types (should be imported from prisma but simplistic here)
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

export default function LeadFinderPage({
    initialLeads = [],
    initialSources = []
}: {
    initialLeads?: Lead[],
    initialSources?: ScanSource[]
}) {
    // Note: In Next.js client component without initial props passed from Server Component wrapper, 
    // we fetch on mount or use server actions in useEffect. 
    // For simplicity, we assume this component is WRAPPED or we fetch inside. 
    // Let's make this a client component that fetches data on mount for dynamic updates 
    // OR we convert to Server Component + Client Wrapper.
    // I'll stick to full client data fetching for the interactive parts or hybrid.
    // Let's do hybrid: The page uses Client hooks but we need initial data.
    // Actually, I'll write the page as a Server Component that passes data to a Client Component.
    return <LeadFinderClient />;
}

// --- CLIENT COMPONENT ---

function LeadFinderClient() {
    const [scanning, setScanning] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [sources, setSources] = useState<ScanSource[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [leadsFilter, setLeadsFilter] = useState<'NEW' | 'REVIEWED' | 'ALL'>('NEW');

    const router = useRouter();

    // Fetch Data
    const refreshData = async () => {
        setLoadingData(true);
        const [l, s] = await Promise.all([
            getLeads(leadsFilter),
            getScanSources()
        ]);
        setLeads(l as any);
        setSources(s as any);
        setLoadingData(false);
    };

    // Initial Load
    useState(() => {
        refreshData();
    });

    const handleScan = async () => {
        setScanning(true);
        toast.info("Scan started... this may take a minute.");
        try {
            const res = await runScanAction();
            if (res.success) {
                toast.success(`Scan complete! Found ${res.leadsCreated} new leads.`);
                refreshData();
            }
        } catch (e) {
            toast.error("Scan failed. Check logs.");
        } finally {
            setScanning(false);
        }
    };

    const handleAddSource = async (formData: FormData) => {
        const name = formData.get('name') as string;
        const type = formData.get('type') as 'RSS' | 'URL';
        const url = formData.get('url') as string;

        if (!name || !url) return;

        await addScanSource(name, type, url);
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
        setLeads(prev => prev.filter(l => l.id !== id)); // Optimistic remove if filter is NEW
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
                            <AddSourceDialog onAdd={handleAddSource} />
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
                            <Tabs value={leadsFilter} onValueChange={(v: any) => { setLeadsFilter(v); setTimeout(refreshData, 100); }} className="w-[300px]">
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
                                    <div className="text-center py-10 text-muted-foreground">No leads found. running a scan?</div>
                                ) : (
                                    leads.map(lead => (
                                        <LeadCard key={lead.id} lead={lead} onStatusUpdate={handleStatusUpdate} />
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function AddSourceDialog({ onAdd }: { onAdd: (fd: FormData) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Source</DialogTitle>
                </DialogHeader>
                <form action={(fd) => { onAdd(fd); setOpen(false); }} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Source Name</Label>
                        <Input name="name" placeholder="e.g. Local Car Club" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select name="type" defaultValue="URL">
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
                        <Input name="url" placeholder="https://..." required />
                    </div>
                    <Button type="submit" className="w-full">Save Source</Button>
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
                            Score: {Math.round(lead.score)}
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
