import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getAffiliateUrl = (url: string) => {
    try {
        if (!url) return '#';
        // Encode the target URL to pass it safely as a parameter
        const encodedUrl = encodeURIComponent(url);
        // Return the path to our smart redirect API
        return `/api/redirect?url=${encodedUrl}`;
    } catch (e) {
        return url;
    }
};
