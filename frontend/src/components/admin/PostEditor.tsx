'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Save, ArrowLeft, Eye, Edit3, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PostEditorProps {
    adminSlug: string;
    postId?: string; // If present, we are editing
    initialData?: any;
}

export default function PostEditor({ adminSlug, postId, initialData }: PostEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    // Form State
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
    const [published, setPublished] = useState(initialData?.published || false);

    // Auto-generate slug from title if creating new
    useEffect(() => {
        if (!postId && title) {
            setSlug(title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, ''));
        }
    }, [title, postId]);

    const handleSave = async () => {
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
                // Update
                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', postId);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('posts')
                    .insert([postData]);
                if (error) throw error;
            }

            router.push(`/${adminSlug}/blog`);
            router.refresh();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Error al guardar. Revisa la consola.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            {/* Header Actions */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
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
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('write')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'write' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="flex items-center gap-2"><Edit3 className="w-4 h-4" /> Escribir</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> Vista Previa</span>
                        </button>
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-2" />
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Publicar</span>
                    </label>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Column: Metadata & Settings */}
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Título del artículo..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Extracto (SEO)</label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                placeholder="Breve descripción para Google..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Imagen de Portada (URL)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder="https://..."
                                />
                                {/* Future: Image Uploader Button */}
                            </div>
                            {coverImage && (
                                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                                    <img src={coverImage} alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Content Editor */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-full">
                    {activeTab === 'write' ? (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 w-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                            placeholder="# Escribe tu artículo aquí en Markdown..."
                        />
                    ) : (
                        <div className="flex-1 w-full p-8 overflow-y-auto prose prose-indigo max-w-none">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
