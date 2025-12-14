import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ admin_slug: string }>;
}) {
    const { admin_slug } = await params;
    const secretRoute = process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET;

    // 1. Validate Route Secret
    if (admin_slug !== secretRoute) {
        notFound();
    }

    // 2. Check Session & Role
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignored
                    }
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log(`[Layout] Path: ${admin_slug}, User: ${user?.email}`);

    if (!user) {
        console.log('[Layout] No user, rendering children only');
        return <>{children}</>;
    }

    // 3. Verify Admin Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        // Logged in but not admin -> Redirect or 404
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar adminSlug={admin_slug} />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
