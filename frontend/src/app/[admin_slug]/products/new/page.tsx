import { notFound } from 'next/navigation';
import ProductEditor from '@/components/admin/ProductEditor';

export default async function NewProductPage({
    params,
}: {
    params: Promise<{ admin_slug: string }>;
}) {
    const { admin_slug } = await params;
    const secretRoute = process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET;

    if (admin_slug !== secretRoute) {
        notFound();
    }

    return <ProductEditor adminSlug={admin_slug} />;
}
