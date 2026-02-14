
"use server";

export async function getCloudinaryConfig() {
    return {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        // The API Key is safe to expose to the client for uploads
        apiKey: process.env.CLOUDINARY_API_KEY
    };
}
