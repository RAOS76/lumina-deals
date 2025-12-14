import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Edit, Trash2, Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import ContentActions from '@/components/admin/ContentActions';

export default async function ContentPage({
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

    // Fetch Articles
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Contenido</h1>
                    <p className="text-slate-500">Gestiona los artículos del blog.</p>
                </div>
                <Link
                    href={`/${admin_slug}/content/new`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Artículo
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {articles?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="w-8 h-8 opacity-50" />
                                            <p>No hay artículos creados aún.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {articles?.map((article) => (
                                <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{article.title}</p>
                                        <p className="text-xs text-slate-400 font-mono">/{article.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${article.status === 'published'
                                                ? 'bg-green-50 text-green-600'
                                                : article.status === 'draft'
                                                    ? 'bg-amber-50 text-amber-600'
                                                    : 'bg-slate-100 text-slate-500'
                                                }`}
                                        >
                                            {article.status === 'published' ? 'Publicado' : article.status === 'draft' ? 'Borrador' : 'Archivado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ContentActions
                                            adminSlug={admin_slug}
                                            articleId={article.id}
                                            articleSlug={article.slug}
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
