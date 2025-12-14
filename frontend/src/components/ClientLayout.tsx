'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET;
    const isAdmin = adminSecret && pathname.startsWith(`/${adminSecret}`);

    return (
        <>
            {!isAdmin && <Navbar />}
            {children}
            {!isAdmin && <Footer />}
            {!isAdmin && <NewsletterPopup />}
        </>
    );
}
