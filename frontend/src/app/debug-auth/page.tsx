import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function DebugAuthPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    let profile = null;
    let profileError = null;

    if (user) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        profile = data;
        profileError = error;
    }

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Debug Auth</h1>

            <div className="space-y-4">
                <div className="bg-slate-100 p-4 rounded">
                    <h2 className="font-bold">User Session</h2>
                    <pre>{JSON.stringify({ user: user?.email, id: user?.id, error: userError }, null, 2)}</pre>
                </div>

                <div className="bg-slate-100 p-4 rounded">
                    <h2 className="font-bold">Profile (RLS Check)</h2>
                    <pre>{JSON.stringify({ profile, error: profileError }, null, 2)}</pre>
                </div>

                <div className="bg-slate-100 p-4 rounded">
                    <h2 className="font-bold">Cookies</h2>
                    <pre>{JSON.stringify(cookieStore.getAll().map(c => c.name), null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
