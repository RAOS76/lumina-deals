import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Clock, Tag, TrendingDown, Brain, ShoppingBag, Star, MessageSquare } from 'lucide-react';
import { SparkAreaChart } from '@tremor/react';
import { getAffiliateUrl } from '@/lib/utils';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getProduct(slug: string) {
    console.log(`[DealPage] Fetching product for slug: "${slug}"`);

    // Handle Simulated Products (Demo Fallback)
    if (slug.startsWith('sim-')) {
        console.log(`[DealPage] Detected simulated product: ${slug}`);
        return {
            id: slug,
            slug: slug,
            clean_title: 'Producto Simulado (Demo)',
            current_price: 29.99,
            original_price: 49.99,
            discount_percentage: 40,
            image_url: 'https://placehold.co/600x400/png?text=Demo+Product',
            category: 'Demo',
            lumina_score: 88,
            ai_summary: 'Este es un producto simulado generado para la demostración cuando no hay resultados reales disponibles.',
            ai_badge: '💡 Demo',
            sales_phrase: 'Producto de ejemplo.',
            product_url: 'https://www.amazon.com',
            rating: 4.5,
            review_count: 120,
            price_history: []
        };
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error) {
        console.error(`[DealPage] Error fetching product:`, error);
        return null;
    }

    if (!data) {
        console.warn(`[DealPage] No product found for slug: "${slug}"`);
        return null;
    }

    console.log(`[DealPage] Product found: ${data.clean_title}`);
    return data;
}

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product) return { title: 'Oferta no encontrada' };

    return {
        title: `${product.clean_title} - Análisis de Oferta | Lumina`,
        description: product.ai_summary,
        openGraph: {
            images: [product.image_url],
        },
    };
}

export default async function DealPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    // Format price history for chart
    const chartData = product.price_history?.map((p: any) => ({
        date: new Date(p.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        Price: p.price,
    })) || [];

    return (
        <main className="min-h-screen bg-slate-50 pb-20 pt-20">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al feed
                </Link>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Hero Section */}
                    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                        <div className="relative aspect-square md:aspect-auto bg-white rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-100">
                            <img
                                src={product.image_url}
                                alt={product.clean_title}
                                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500"
                            />
                            {product.discount_percentage > 0 && (
                                <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                                    <TrendingDown className="w-4 h-4" />
                                    -{product.discount_percentage}%
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <Brain className="w-3 h-3" />
                                    {product.ai_badge}
                                </span>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {product.category}
                                </span>
                                {product.sales_rank && (
                                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 border border-amber-200">
                                        <TrendingDown className="w-3 h-3" />
                                        {product.sales_rank}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                                {product.clean_title}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-slate-600 font-medium">
                                    {product.rating} <span className="text-slate-400">({product.review_count?.toLocaleString()} reviews)</span>
                                </span>
                            </div>

                            {/* Coupon Badge */}
                            {product.coupon_text && (
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm animate-pulse">
                                        🎟️ {product.coupon_text}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-baseline gap-3 mb-8">
                                <span className="text-4xl font-bold text-slate-900">
                                    ${product.current_price.toFixed(2)}
                                </span>
                                {product.original_price > product.current_price && (
                                    <span className="text-xl text-slate-400 line-through">
                                        ${product.original_price.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <a
                                href={getAffiliateUrl(product.product_url)}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Ver Oferta en Amazon
                                <ExternalLink className="w-4 h-4 opacity-50" />
                            </a>
                            <p className="text-xs text-center text-slate-400 mt-3">
                                Como afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos.
                            </p>
                        </div>
                    </div>

                    {/* Analysis Content */}
                    <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:p-8">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Brain className="w-6 h-6 text-indigo-600" />
                                El Veredicto de la IA
                            </h2>
                            <div className="prose prose-slate max-w-none mb-8">
                                <p className="text-lg leading-relaxed text-slate-700">
                                    {product.ai_summary}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                                    Historial de Precios
                                </h3>
                                <div className="h-48 w-full">
                                    <SparkAreaChart
                                        data={chartData}
                                        categories={['Price']}
                                        index="date"
                                        colors={['emerald']}
                                        className="h-full w-full"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-center">
                                    Precios rastreados en los últimos 30 días
                                </p>
                            </div>

                            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                                <h3 className="font-bold text-indigo-900 mb-2">¿Por qué esta oferta?</h3>
                                <p className="text-indigo-700 font-medium italic">
                                    "{product.sales_phrase}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.clean_title,
                        image: product.image_url,
                        description: product.ai_summary,
                        brand: {
                            '@type': 'Brand',
                            name: 'Amazon',
                        },
                        offers: {
                            '@type': 'Offer',
                            url: product.product_url,
                            priceCurrency: 'USD',
                            price: product.current_price,
                            priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Valid for 7 days
                            availability: 'https://schema.org/InStock',
                            seller: {
                                '@type': 'Organization',
                                name: 'Amazon',
                            },
                        },
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: product.rating || 0,
                            reviewCount: product.review_count || 0,
                            bestRating: '5',
                            worstRating: '1',
                        },
                        review: {
                            '@type': 'Review',
                            reviewRating: {
                                '@type': 'Rating',
                                ratingValue: product.lumina_score ? Math.round(product.lumina_score / 20) : 4, // Convert 0-100 to 0-5
                                bestRating: '5',
                            },
                            author: {
                                '@type': 'Organization',
                                name: 'Lumina AI',
                            },
                            reviewBody: product.ai_summary,
                        },
                    }),
                }}
            />
        </main >
    );
}
