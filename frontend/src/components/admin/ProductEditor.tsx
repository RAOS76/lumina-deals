'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

interface Product {
    id?: string;
    title: string;
    clean_title: string;
    slug: string;
    current_price: number;
    original_price: number;
    discount_percentage: number;
    image_url: string;
    category: string;
    lumina_score: number;
    description: string;
    affiliate_link: string;
}

export default function ProductEditor({
    adminSlug,
    initialData,
}: {
    adminSlug: string;
    initialData?: Product;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Product>(
        initialData || {
            title: '',
            clean_title: '',
            slug: '',
            current_price: 0,
            original_price: 0,
            discount_percentage: 0,
            image_url: '',
            category: 'Tecnología',
            lumina_score: 0,
            description: '',
            affiliate_link: '',
        }
    );

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                updated_at: new Date().toISOString(),
            };

            let result;
            if (initialData?.id) {
                // Update
                result = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', initialData.id);
            } else {
                // Create
                result = await supabase.from('products').insert([payload]);
            }

            if (result.error) throw result.error;

            router.push(`/${adminSlug}/products`);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${adminSlug}/products`}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {initialData ? 'Editar Producto' : 'Nuevo Producto'}
                    </h1>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Título Limpio</label>
                            <input
                                type="text"
                                required
                                value={formData.clean_title}
                                onChange={(e) => setFormData({ ...formData, clean_title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                                placeholder="Nombre corto del producto..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Título Original (Amazon)</label>
                            <textarea
                                rows={2}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción / Análisis</label>
                            <textarea
                                rows={6}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="font-bold text-slate-900">Precios y Oferta</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Actual</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.current_price}
                                    onChange={(e) => setFormData({ ...formData, current_price: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Original</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.original_price}
                                    onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descuento %</label>
                                <input
                                    type="number"
                                    value={formData.discount_percentage}
                                    onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-green-600 font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="font-bold text-slate-900">Detalles</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="Tecnología">Tecnología</option>
                                <option value="Hogar">Hogar</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Salud">Salud</option>
                                <option value="Oficina">Oficina</option>
                                <option value="Moda">Moda</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lumina Score</label>
                            <input
                                type="number"
                                max="100"
                                value={formData.lumina_score}
                                onChange={(e) => setFormData({ ...formData, lumina_score: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs font-mono"
                            />
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="font-bold text-slate-900">Imagen</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Imagen del Producto</label>
                            <ImageUploader
                                value={formData.image_url}
                                onChange={(url: string) => setFormData({ ...formData, image_url: url })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
