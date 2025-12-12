import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getAffiliateUrl = (url: string) => {
    try {
        if (!url) return '#';
        if (!url.includes('amazon')) return url;

        const urlObj = new URL(url);
        const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || 'lumina-demo-20'; // Fallback tag

        // Remove existing tag if present to avoid duplicates/conflicts
        if (urlObj.searchParams.has("tag")) {
            urlObj.searchParams.delete("tag");
        }

        urlObj.searchParams.set("tag", tag);
        return urlObj.toString();
    } catch (e) {
        return url;
    }
};
