'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Globe, Lock, Trash2, AlertCircle, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import WordCounter from './WordCounter';
import PreviewModal from './PreviewModal';


const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-50 animate-pulse rounded-xl border border-slate-100 flex items-center justify-center">
            <div className="text-slate-400 font-medium">Cargando editor...</div>
        </div>
    )
});

interface PostEditorProps {
    adminSlug: string;
    postId?: string;
    initialData?: any;
}

export default function PostEditor({ adminSlug, postId, initialData }: PostEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Form State
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
    const [published, setPublished] = useState(initialData?.published || false);

    // Autosave State
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Preview Modal State
    const [showPreview, setShowPreview] = useState(false);

    // Auto-generate slug from title if creating new
    useEffect(() => {
        if (!postId && title) {
            setSlug(title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, ''));
        }
    }, [title, postId]);

    // Track unsaved changes
    useEffect(() => {
        setHasUnsavedChanges(true);
    }, [title, slug, excerpt, content, coverImage, published]);

    // Autosave functionality
    useEffect(() => {
        if (!postId || !hasUnsavedChanges || isSaving || loading) return;

        const autoSaveTimer = setTimeout(async () => {
            if (!title.trim() || !slug.trim()) return;

            setIsSaving(true);
            try {
                const postData = {
                    title,
                    slug,
                    excerpt,
                    content,
                    cover_image: coverImage,
                    published,
                    updated_at: new Date().toISOString(),
                };

                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', postId);

                if (!error) {
                    setLastSaved(new Date());
                    setHasUnsavedChanges(false);
                }
            } catch (error) {
                console.error('Autosave error:', error);
            } finally {
                setIsSaving(false);
            }
        }, 30000); // 30 seconds

        return () => clearTimeout(autoSaveTimer);
    }, [postId, title, slug, excerpt, content, coverImage, published, hasUnsavedChanges, isSaving, loading, supabase]);

    const handleSave = async () => {
        if (!title.trim() || !slug.trim()) {
            alert('Por favor, completa el título y el slug.');
            return;
        }

        setLoading(true);
        try {
            const postData = {
                title,
                slug,
                excerpt,
                content,
                cover_image: coverImage,
                published,
                updated_at: new Date().toISOString(),
            };

            if (postId) {
                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', postId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert([postData]);
                if (error) throw error;
            }

            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            router.push(`/${adminSlug}/blog`);
            router.refresh();
        } catch (error: any) {
            console.error('Error saving post:', error);
            alert(`Error al guardar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);
            if (error) throw error;
            router.push(`/${adminSlug}/blog`);
        } catch (error: any) {
            console.error('Error deleting post:', error);
            alert(`Error al eliminar: ${error.message}`);
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            {/* Header Actions */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100 shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${adminSlug}/blog`}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">
                        {postId ? 'Editar Artículo' : 'Nuevo Artículo'}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Autosave Indicator */}
                    {postId && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            {isSaving ? (
                                <>
                                    <Clock className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                                    <span className="text-xs font-medium text-slate-500">Guardando...</span>
                                </>
                            ) : lastSaved ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-xs font-medium text-slate-600">
                                        Guardado {lastSaved.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </>
                            ) : hasUnsavedChanges ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="text-xs font-medium text-amber-600">Cambios sin guardar</span>
                                </>
                            ) : null}
                        </div>
                    )}

                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${published ? 'text-green-600' : 'text-amber-600'}`}>
                            {published ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            {published ? 'Público' : 'Borrador'}
                        </span>
                        <div className="w-px h-4 bg-slate-200" />
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={published}
                                onChange={(e) => setPublished(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <button
                        onClick={() => setShowPreview(true)}
                        className="bg-slate-600 text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg shadow-slate-100 flex items-center gap-2 active:scale-95"
                    >
                        <Eye className="w-4 h-4" />
                        Previsualizar
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {loading ? '...' : 'Guardar'}
                    </button>

                    {postId && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Left Column: Metadata & Settings */}
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-slate-900 transition-all"
                                placeholder="Título del artículo..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Slug (URL)</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-[11px] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Extracto (SEO)</label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all resize-none leading-relaxed"
                                placeholder="Breve descripción para Google..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Imagen de Portada</label>
                            <input
                                type="text"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs transition-all"
                                placeholder="https://..."
                            />
                            {coverImage && (
                                <div className="mt-4 relative aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                    <img src={coverImage} alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                        </div>

                        {/* Word Counter */}
                        <div className="pt-6 border-t border-slate-100">
                            <WordCounter content={content} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Rich Text Editor */}
                <div className="lg:col-span-3 min-h-0">
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Escribe tu artículo aquí..."
                    />
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">¿Eliminar artículo?</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Esta acción es permanente y no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                {loading ? '...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            <PreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                post={{
                    title,
                    content,
                    coverImage,
                    excerpt,
                    createdAt: initialData?.created_at
                }}
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e2e8f0;
                }
            `}</style>
        </div>
    );
}
