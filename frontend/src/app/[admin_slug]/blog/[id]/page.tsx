import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ admin_slug: string; id: string }>;
}) {
    const { admin_slug, id } = await params;
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

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (!post) {
        notFound();
    }

    return (
        <PostEditor
            adminSlug={admin_slug}
            postId={id}
            initialData={post}
        />
    );
}
