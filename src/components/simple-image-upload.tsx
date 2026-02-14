
"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, X, UploadCloud, Trash } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getCloudinaryConfig } from "@/app/actions/cloudinary";

interface SimpleImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function SimpleImageUpload({ value, onChange, disabled }: SimpleImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setProgress(0);

        try {
            // 1. Get Config
            const config = await getCloudinaryConfig();
            if (!config.cloudName || !config.apiKey) {
                throw new Error("Cloudinary configuration missing");
            }

            // 2. Get Signature
            const timestamp = Math.round((new Date).getTime() / 1000);
            const paramsToSign = {
                timestamp,
                folder: "car-show-calendar" // Optional
            };

            const signatureRes = await fetch("/api/sign-cloudinary-params", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paramsToSign }),
            });

            if (!signatureRes.ok) throw new Error("Failed to sign upload");
            const { signature } = await signatureRes.json();

            // 3. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", config.apiKey);
            formData.append("timestamp", String(timestamp));
            formData.append("signature", signature);
            formData.append("folder", "car-show-calendar");

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const p = Math.round((event.loaded / event.total) * 100);
                    setProgress(p);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    onChange(response.secure_url);
                    toast.success("Image uploaded!");
                } else {
                    console.error("Upload failed:", xhr.responseText);
                    toast.error("Upload failed. Please try again.");
                }
                setIsUploading(false);
            };

            xhr.onerror = () => {
                console.error("Upload error");
                toast.error("Network error during upload.");
                setIsUploading(false);
            };

            xhr.send(formData);

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong with the upload.");
            setIsUploading(false);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        onChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        disabled={disabled || isUploading}
                        className="gap-2"
                    >
                        <Trash className="h-4 w-4" /> Remove
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={triggerUpload}
                        disabled={disabled || isUploading}
                    >
                        Change Image
                    </Button>
                </div>
                {/* Hidden input for change */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={disabled || isUploading}
                />
            </div>
        );
    }

    return (
        <div
            onClick={triggerUpload}
            className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col gap-4 items-center justify-center transition-all cursor-pointer group
                ${isUploading ? "border-primary/50 bg-primary/5" : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50"}
            `}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={disabled || isUploading}
            />

            {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium animate-pulse">Uploading... {progress}%</p>
                </div>
            ) : (
                <>
                    <div className="p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                            Click to upload poster
                        </p>
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG, WEBP up to 10MB
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
