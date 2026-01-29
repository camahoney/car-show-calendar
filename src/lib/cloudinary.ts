import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function getSignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder: 'car-shows' },
        process.env.CLOUDINARY_API_SECRET!
    );
    return { timestamp, signature };
}

// Development Mock Uploader
// Uses a dummy image if keys are missing
export const MOCK_IMAGE_URL = "https://res.cloudinary.com/demo/image/upload/v1649842407/sample.jpg";

export function isCloudinaryConfigured() {
    return !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET);
}
