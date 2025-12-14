import { notFound } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default async function NewArticlePage({
    params,
}: {
    params: Promise<{ admin_slug: string }>;
}) {
    const { admin_slug } = await params;
    const secretRoute = process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET;

    if (admin_slug !== secretRoute) {
        notFound();
    }

    return <ArticleEditor adminSlug={admin_slug} />;
}
