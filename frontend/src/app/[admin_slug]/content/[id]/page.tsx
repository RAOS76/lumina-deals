import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ admin_slug: string; id: string }>;
}) {
    const { admin_slug, id } = await params;
    const secretRoute = process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET;

    if (admin_slug !== secretRoute) {
        notFound();
    }

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

    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (!article) {
        notFound();
    }

    return <ArticleEditor adminSlug={admin_slug} initialData={article} />;
}
