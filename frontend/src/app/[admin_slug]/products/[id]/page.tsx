import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ProductEditor from '@/components/admin/ProductEditor';

export default async function EditProductPage({
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

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (!product) {
        notFound();
    }

    return <ProductEditor adminSlug={admin_slug} initialData={product} />;
}
