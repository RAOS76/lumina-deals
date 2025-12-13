import { createClient } from '@supabase/supabase-js';
import DealPost from '@/components/DealPost';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import { Sparkles, Trophy, TrendingDown } from 'lucide-react';
import Link from 'next/link';

// Inicializar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0; // Desactivar caché para datos frescos

async function getCategoryProducts(category: string, subcategory: string) {
    // Filtrado estricto por categoría y subcategoría
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('subcategory', subcategory)
        .order('lumina_score', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching category products:', error);
        return [];
    }

    return data || [];
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string; subcategory: string }>;
}) {
    const { category, subcategory } = await params;
    const products = await getCategoryProducts(category, subcategory);

    if (!products || products.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    No encontramos ofertas en {subcategory.replace(/-/g, ' ')}
                </h1>
                <p className="text-slate-600 mb-6">
                    Nuestro robot está buscando nuevas ofertas. Vuelve en unas horas.
                </p>
                <Link href="/" className="text-indigo-600 hover:underline">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    const heroProduct = products[0];
    const otherProducts = products.slice(1);

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section - La Elección del Editor */}
            <section className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            La Elección del Editor
                        </span>
                        <span className="text-slate-400 text-sm">
                            en {subcategory.replace(/-/g, ' ')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                                {heroProduct.clean_title}
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                {heroProduct.ai_summary}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                                    <Trophy className="w-5 h-5 text-green-600" />
                                    <span className="font-bold text-green-700">
                                        Lumina Score: {heroProduct.lumina_score}/100
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                                    <TrendingDown className="w-5 h-5 text-blue-600" />
                                    <span className="font-bold text-blue-700">
                                        -{heroProduct.discount_percentage}% Descuento
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link
                                    href={`/deal/${heroProduct.slug}`}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/30"
                                >
                                    Leer Análisis Completo
                                </Link>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 relative">
                            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={heroProduct.image_url}
                                    alt={heroProduct.clean_title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-slate-900 shadow-sm border border-slate-100">
                                    ${heroProduct.current_price}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid de otras ofertas */}
            {otherProducts.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex items-center gap-3 mb-10">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-slate-900">
                            Otras Oportunidades Destacadas
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
