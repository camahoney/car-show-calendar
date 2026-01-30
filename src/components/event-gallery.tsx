"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addEventPhoto } from "@/app/actions/photo";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface EventGalleryProps {
    eventId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    photos: any[]; // Prisma type
    userId?: string;
}

export function EventGallery({ eventId, photos, userId }: EventGalleryProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUpload = async (result: any) => {
        setIsUploading(true);
        try {
            const url = result.info.secure_url;
            const res = await addEventPhoto(eventId, url);

            if (res.success) {
                toast({ title: "Photo added!", description: "High five! 👋" });
                router.refresh();
            } else {
                toast({ title: "Error", description: "Failed to save photo.", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Event Gallery</h3>
                {userId && (
                    <CldUploadWidget
                        onSuccess={onUpload}
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "car-show-preset"}
                        options={{
                            tags: ["event-photo", `event-${eventId}`],
                            maxFiles: 5,
                        }}
                    >
                        {({ open }) => (
                            <Button
                                onClick={() => open()}
                                disabled={isUploading}
                                className="bg-white/10 text-white hover:bg-white/20"
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                Add Photos
                            </Button>
                        )}
                    </CldUploadWidget>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer">
                        <Image
                            src={photo.url}
                            alt="Event photo"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <p className="text-xs text-white  font-medium">
                                Added {formatDistanceToNow(new Date(photo.createdAt))} ago
                            </p>
                        </div>
                    </div>
                ))}

                {photos.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white/5 rounded-xl border border-white/5 border-dashed">
                        <p className="text-muted-foreground">No photos yet. Be the first to add one!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
