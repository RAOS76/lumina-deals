'use client';

import { Edit, Trash2, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function ContentActions({
    adminSlug,
    articleId,
    articleSlug,
}: {
    adminSlug: string;
    articleId: string;
    articleSlug: string;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar este artículo?')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', articleId);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            alert('Error al eliminar el artículo');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Link
                href={`/blog/${articleSlug}`}
                target="_blank"
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Ver en web"
            >
                <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
                href={`/${adminSlug}/content/${articleId}`}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Editar"
            >
                <Edit className="w-4 h-4" />
            </Link>
            <button
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Eliminar"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
        </div>
    );
}
