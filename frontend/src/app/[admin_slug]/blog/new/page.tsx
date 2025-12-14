import PostEditor from '@/components/admin/PostEditor';

export default async function NewPostPage({
    params,
}: {
    params: Promise<{ admin_slug: string }>;
}) {
    const { admin_slug } = await params;

    return <PostEditor adminSlug={admin_slug} />;
}
