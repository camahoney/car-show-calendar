"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Trash, UploadCloud } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration mismatch
    useState(() => {
        setIsMounted(true);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUpload = useCallback((result: any) => {
        onChange(result.info.secure_url);
    }, [onChange]);

    if (!isMounted) return null;

    if (value) {
        return (
            <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-primary/20 bg-black/40 shadow-2xl group">
                <Image
                    fill
                    style={{ objectFit: "cover" }}
                    alt="Event Poster"
                    src={value}
                    className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => onChange("")}
                        disabled={disabled}
                        className="gap-2"
                    >
                        <Trash className="h-4 w-4" /> Remove Poster
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <CldUploadWidget
            onSuccess={onUpload}
            uploadPreset="car-show-calendar" // Use 'unsigned' preset or 'default' if not configured? 
        // Note: Cloudinary usually needs an upload preset. 
        // If the user hasn't created one, 'ml_default' often works for unsigned, but 'signed' (default in next-cloudinary?) works with API keys.
        // Let's try Standard Mode (Signed) which uses the API keys we just added.
        // But CldUploadWidget is client-side. It usually needs a preset OR a signature endpoint.
        // next-cloudinary handles signature automatically if keys are in .env!
        // BUT we need to pass `signatureEndpoint` or rely on default `/api/sign-cloudinary-params`.
        // next-cloudinary includes a route handler helper.
        >
            {({ open }) => {
                const onClick = () => {
                    open();
                };

                return (
                    <div
                        onClick={onClick}
                        className="w-full h-64 border-2 border-dashed border-white/20 rounded-xl flex flex-col gap-4 items-center justify-center bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group"
                    >
                        <div className="p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-lg font-medium text-white group-hover:text-primary transition-colors">Upload Event Poster</p>
                            <p className="text-xs text-muted-foreground">Click to browse or drag & drop</p>
                        </div>
                    </div>
                );
            }}
        </CldUploadWidget>
    );
}
