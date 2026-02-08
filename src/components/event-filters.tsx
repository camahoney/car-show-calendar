"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Calendar, Filter } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EventFilters({ states = [] }: { states?: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Initial State from URL
    const currentFilter = searchParams.get("filter") || "all";
    const currentState = searchParams.get("state") || "all";
    const currentSearch = searchParams.get("q") || "";
    const [searchValue, setSearchValue] = useState(currentSearch);

    // Update URL helper
    const updateParams = useCallback((newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === "all") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        startTransition(() => {
            router.push(`/events?${params.toString()}`);
        });
    }, [searchParams, router]);

    // Handlers
    const handleFilterClick = (filter: string) => {
        if (filter === currentFilter) return; // No change
        updateParams({ filter: filter === 'all' ? null : filter });
    };

    const handleStateChange = (value: string) => {
        updateParams({ state: value === 'all' ? null : value });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ q: searchValue || null });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="flex flex-wrap gap-2 items-center">
                    <FilterButton
                        active={currentFilter === 'all'}
                        onClick={() => handleFilterClick('all')}
                        label="All Upcoming"
                    />
                    <FilterButton
                        active={currentFilter === 'weekend'}
                        onClick={() => handleFilterClick('weekend')}
                        label="This Weekend"
                        icon={Calendar}
                    />
                    <FilterButton
                        active={currentFilter === 'month'}
                        onClick={() => handleFilterClick('month')}
                        label="This Month"
                    />

                    {/* Integrated State Filter */}
                    <div className="ml-2">
                        <Select value={currentState} onValueChange={handleStateChange}>
                            <SelectTrigger className="w-[180px] bg-transparent border-white/10 text-white rounded-full h-9">
                                <SelectValue placeholder="Filter by State" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                {states.map((state) => (
                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex gap-2">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            className="pl-9 glass border-white/10"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 font-bold" disabled={isPending}>
                        {isPending ? "..." : "Search"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon?: any }) {
    return (
        <Button
            variant={active ? "default" : "outline"}
            size="sm"
            onClick={onClick}
            className={cn(
                "rounded-full border-white/10 transition-all",
                active ? "bg-white text-black hover:bg-white/90" : "bg-transparent text-muted-foreground hover:text-white hover:bg-white/5"
            )}
        >
            {Icon && <Icon className="mr-2 h-3.5 w-3.5" />}
            {label}
        </Button>
    )
}
