import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ExternalLink, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import ProductActions from '@/components/admin/ProductActions';

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ admin_slug: string }>;
}) {
    const { admin_slug } = await params;
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

    // Fetch Products (Limit 50 for now)
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
                    <p className="text-slate-500">Gestiona el inventario y las ofertas activas.</p>
                </div>
                <Link
                    href={`/${admin_slug}/products/new`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    + Nuevo Producto
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descuento</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products?.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={product.image_url} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 line-clamp-1 max-w-xs" title={product.clean_title}>
                                                    {product.clean_title}
                                                </p>
                                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {product.category}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        ${product.current_price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.discount_percentage > 0 ? (
                                            <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg text-xs">
                                                -{product.discount_percentage}%
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.lumina_score ? (
                                            <span className="font-bold text-indigo-600">{product.lumina_score}</span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ProductActions
                                            adminSlug={admin_slug}
                                            productId={product.id}
                                            productSlug={product.slug}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
