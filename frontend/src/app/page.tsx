import { createClient } from '@supabase/supabase-js';
import DealPost from '../components/DealPost';
import SearchBar from '../components/SearchBar';
import MaintenancePage from '../components/MaintenancePage';
import CookieBanner from '../components/CookieBanner';
import AdPlaceholder from '../components/AdPlaceholder';
import { Sparkles } from 'lucide-react';
import { Suspense } from 'react';

// Inicializar cliente Supabase (usando vars públicas para el cliente)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Inicialización segura: si faltan keys, supabase será null (evita crash en build)
let supabase: ReturnType<typeof createClient> | null = null;

try {
    if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
    }
} catch (e) {
    console.warn("⚠️ Falló inicialización de Supabase:", e);
}

// Desactivar caché estática para búsqueda en tiempo real
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    // Check for Maintenance Mode
    if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
        return <MaintenancePage />;
    }

    const { q } = await searchParams;
    const query = q || '';

    // Datos Mock para Demo
    const MOCK_PRODUCTS = [
        {
            id: '1',
            clean_title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
            original_price: 399.99,
            current_price: 298.00,
            discount_percentage: 25,
            ai_summary: 'Cancelación de ruido líder en la industria con 30 horas de batería. Diseño ultra cómodo para viajes largos.',
            ai_badge: '🎧 Top Choice',
            sales_phrase: 'Tu silencio nunca sonó tan bien.',
            image_url: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_SL1000_.jpg',
            product_url: 'https://www.amazon.com/Sony-WH-1000XM5-Canceling-Headphones-Hands-Free/dp/B09XS7JWHH',
            price_history: [
                { date: '2023-11-01', price: 399.99 },
                { date: '2023-11-10', price: 348.00 },
                { date: '2023-11-20', price: 298.00 },
                { date: '2023-12-01', price: 298.00 }
            ]
        },
        {
            id: '2',
            clean_title: '2021 Apple MacBook Pro (14-inch, M1 Pro)',
            original_price: 1999.00,
            current_price: 1599.00,
            discount_percentage: 20,
            ai_summary: 'Potencia bruta con el chip M1 Pro. Pantalla Liquid Retina XDR que redefine lo que es posible en una laptop.',
            ai_badge: '💻 Powerhouse',
            sales_phrase: 'Creatividad sin límites.',
            image_url: 'https://m.media-amazon.com/images/I/61vFO3R5UNL._AC_SL1500_.jpg',
            product_url: 'https://www.amazon.com/Apple-MacBook-Pro-14-inch-8%E2%80%91core/dp/B09JQL8KP9',
            price_history: [
                { date: '2023-11-01', price: 1999.00 },
                { date: '2023-11-15', price: 1799.00 },
                { date: '2023-12-05', price: 1599.00 }
            ]
        },
        {
            id: '3',
            clean_title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
            original_price: 99.99,
            current_price: 69.95,
            discount_percentage: 30,
            ai_summary: 'Cocina 70% más rápido. 7 electrodomésticos en 1: olla a presión, sartén, vaporera y más.',
            ai_badge: '🍲 Kitchen Essential',
            sales_phrase: 'Cenas deliciosas en minutos, no horas.',
            image_url: 'https://m.media-amazon.com/images/I/71WtwEvYDOS._AC_SL1500_.jpg',
            product_url: 'https://www.amazon.com/Instant-Pot-Pressure-Steamer-Sterilizer/dp/B00FLYWNYQ',
            price_history: [
                { date: '2023-11-01', price: 99.99 },
                { date: '2023-11-15', price: 89.99 },
                { date: '2023-12-05', price: 69.95 }
            ]
        }
    ];


    let products = null;

    try {
        if (!supabase) {
            throw new Error("Missing Supabase Client/Keys");
        }
        // Fetch productos desde Supabase
        let queryBuilder = supabase
            .from('products')
            .select('*')
            .order('discount_percentage', { ascending: false });

        if (query) {
            // Busqueda "fuzzy" en multiples columnas
            queryBuilder = queryBuilder.or(`clean_title.ilike.%${query}%,ai_summary.ilike.%${query}%,ai_badge.ilike.%${query}%`);
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;
        products = data;
    } catch (err) {
        console.warn("⚠️ Usando MOCK DATA (Supabase no conectado o error):", err);
        if (query) {
            const lowerQuery = query.toLowerCase();
            products = MOCK_PRODUCTS.filter(p =>
                p.clean_title.toLowerCase().includes(lowerQuery) ||
                p.ai_summary.toLowerCase().includes(lowerQuery) ||
                p.ai_badge.toLowerCase().includes(lowerQuery)
            );
        } else {
            products = MOCK_PRODUCTS;
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-24" >
            <CookieBanner />

            <CookieBanner />

            {/* Hero Section - Joyas del Mercado */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                        Claridad entre el caos. <span className="text-indigo-600">Ofertas reales.</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                        Lumina utiliza IA avanzada para iluminar las verdaderas oportunidades en Amazon, filtrando miles de productos para entregarte solo lo que brilla.
                    </p>
                    <Suspense fallback={<div className="h-12 bg-slate-100 rounded-xl animate-pulse" />}>
                        <SearchBar />
                    </Suspense>
                </div>

                {/* Market Jewels - Dynamic Layout */}
                <div className="space-y-24">
                    {products?.filter(p => p.is_featured).map((product, index) => (
                        <div key={product.id} className={`flex flex-col md:flex-row${index % 2 !== 0 ? '-reverse' : ''} items-center gap-12`}>
                            <div className="w-full md:w-1/2">
                                <div className="relative aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image_url}
                                        alt={product.clean_title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {product.ai_badge && (
                                        <div className={`absolute top-4 ${index % 2 !== 0 ? 'right-4' : 'left-4'} bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
                                            {product.ai_badge}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 text-left">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                    <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{product.category || 'Destacado'}</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                                    {product.clean_title}
                                </h3>
                                <div className="prose prose-slate text-lg text-slate-600 mb-8">
                                    <p className="mb-4">
                                        {product.ai_summary}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <a href={`/deal/${product.slug}`} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                        Ver Análisis Completo
                                    </a>
                                    <span className="text-2xl font-bold text-slate-900">${product.current_price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feed de Noticias / Blog */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-12">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Últimos Análisis
                    </h3>
                    <span className="text-sm text-slate-500">
                        {products?.length || 0} oportunidades detectadas
                    </span>
                </div>

                {products?.filter(p => p.clean_title && !p.clean_title.includes('Unknown Title')).map((product, index) => (
                    <div key={product.id}>
                        <DealPost product={product} />
                        {/* Insertar anuncio cada 3 posts */}
                        {(index + 1) % 3 === 0 && <AdPlaceholder />}
                    </div>
                ))}

                {(!products || products.length === 0) && (
                    <div className="text-center py-20 text-slate-400">
                        No hay ofertas activas en este momento. Vuelve pronto.
                    </div>
                )}
            </section>
        </main>
    );
}
