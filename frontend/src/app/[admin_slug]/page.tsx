import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';

export default async function AdminLoginPage({
    params,
}: {
    params: Promise<{ admin_slug: string }>;
}) {
    const { admin_slug } = await params;
    const secretRoute = process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET;

    // 1. Validate Route Secret
    if (admin_slug !== secretRoute) {
        notFound(); // Return 404 if route doesn't match secret
    }

    // 2. Check Session
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
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 3. If logged in, redirect to dashboard
    if (user) {
        redirect(`/${admin_slug}/dashboard`);
    }

    // 4. Render Login Form
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <LoginForm adminSlug={admin_slug} />
        </main>
    );
}
