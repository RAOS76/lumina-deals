'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FileText, Settings, LogOut, Shield } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminSidebar({ adminSlug }: { adminSlug: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push(`/${adminSlug}`);
        router.refresh();
    };

    const menuItems = [
        {
            name: 'Dashboard',
            href: `/${adminSlug}/dashboard`,
            icon: LayoutDashboard,
        },
        {
            name: 'Productos',
            href: `/${adminSlug}/products`,
            icon: Package,
        },
        {
            name: 'Blog',
            href: `/${adminSlug}/blog`,
            icon: FileText,
        },
        {
            name: 'Configuración',
            href: `/${adminSlug}/settings`,
            icon: Settings,
        },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-none">Lumina Ops</h1>
                    <span className="text-xs text-slate-400">v1.0.0</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
