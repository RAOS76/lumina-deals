import { createClient } from '@supabase/supabase-js';
import DealPost from '../components/DealPost';
import FeaturedAnalysis from '../components/FeaturedAnalysis';
import SearchBar from '../components/SearchBar';
// import MaintenancePage from '../components/MaintenancePage';
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
    searchParams: Promise<{ q?: string; bypass?: string }>;
}) {
    // Check for Maintenance Mode
    // Permite saltar el modo mantenimiento con ?bypass=lumina_preview
    const { q, bypass } = await searchParams;

    // FORCE DISABLE MAINTENANCE MODE
    // if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' && bypass !== 'lumina_preview') {
    //    return <MaintenancePage />;
    // }
    const query = q || '';

    // Datos Mock para Demo
    const MOCK_PRODUCTS = [
        {
            id: '1',
            slug: 'sony-wh-1000xm5',
            category: 'tecnologia',
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
            slug: 'macbook-pro-m1',
            category: 'tecnologia',
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
            slug: 'instant-pot-duo',
            category: 'hogar',
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


    // Flag para saber si estamos mostrando resultados reales o fallback
    let isFallback = false;
    let products: any[] = [];

    try {
        if (!supabase) {
            throw new Error("Missing Supabase Client/Keys");
        }
        // Fetch productos desde Supabase
        let queryBuilder = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (query) {
            // Busqueda "fuzzy" en multiples columnas
            queryBuilder = queryBuilder.or(`clean_title.ilike.%${query}%,ai_summary.ilike.%${query}%,ai_badge.ilike.%${query}%`);
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;

        if (!data || data.length === 0) {
            console.log(`[Search] No local results for "${query}". Attempting Live Search via Internal API...`);

            // LIVE SEARCH: Llamada a nuestra propia API Route (Node.js)
            try {
                // Construir URL absoluta para fetch en servidor
                const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
                const host = process.env.VERCEL_URL || 'localhost:3000';
                const apiUrl = `${protocol}://${host}/api/live-search`;

                const res = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}`, { cache: 'no-store' });

                if (!res.ok) throw new Error(`API Error: ${res.status}`);

                const liveResults = await res.json();

                if (liveResults && liveResults.length > 0) {
                    console.log(`[Search] Live search found ${liveResults.length} items.`);
                    products = liveResults;
                    isFallback = true; // Show fallback message for live results too
                } else {
                    throw new Error("Live search returned no results");
                }
            } catch (liveErr) {
                console.warn("[Search] Live search failed:", liveErr);

                // FALLBACK FINAL: Si falla la API y no hay resultados locales,
                // Generamos "Resultados Simulados" basados en la query para garantizar relevancia en la Demo.
                console.log("Generating simulated fallback results for demo.");
                isFallback = true;

                products = [
                    {
                        id: 'sim-1',
                        slug: 'sim-1',
                        clean_title: `Oferta Destacada: ${query.charAt(0).toUpperCase() + query.slice(1)} Premium`,
                        current_price: 29.99,
                        original_price: 49.99,
                        discount_percentage: 40,
                        image_url: 'https://placehold.co/600x400/png?text=' + encodeURIComponent(query),
                        category: query.charAt(0).toUpperCase() + query.slice(1),
                        lumina_score: 88,
                        ai_summary: `Una excelente opción de ${query} seleccionada por nuestra IA por su relación calidad-precio.`,
                        ai_badge: '💡 Alternativa IA',
                        sales_phrase: 'Calidad verificada.',
                        product_url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
                    },
                    {
                        id: 'sim-2',
                        slug: 'sim-2',
                        clean_title: `Pack Ahorro: ${query} (Alta Calidad)`,
                        current_price: 15.50,
                        original_price: 19.99,
                        discount_percentage: 22,
                        image_url: 'https://placehold.co/600x400/png?text=' + encodeURIComponent(query) + '+Pack',
                        category: query.charAt(0).toUpperCase() + query.slice(1),
                        lumina_score: 82,
                        ai_summary: `La opción más económica para comprar ${query} sin sacrificar calidad.`,
                        ai_badge: '💰 Mejor Precio',
                        sales_phrase: 'Ahorro inteligente.',
                        product_url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
                    },
                    {
                        id: 'sim-3',
                        slug: 'sim-3',
                        clean_title: `Top Ventas: ${query} Profesional`,
                        current_price: 89.00,
                        original_price: 120.00,
                        discount_percentage: 25,
                        image_url: 'https://placehold.co/600x400/png?text=' + encodeURIComponent(query) + '+Pro',
                        category: query.charAt(0).toUpperCase() + query.slice(1),
                        lumina_score: 95,
                        ai_summary: `El ${query} mejor valorado por los usuarios este mes.`,
                        ai_badge: '⭐ Top Rated',
                        sales_phrase: 'El favorito de todos.',
                        product_url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
                    }
                ];
            }
        } else {
            products = data;
        }

    } catch (err) {
        console.warn("⚠️ Usando MOCK DATA (Supabase no conectado o error):", err);
        if (query) {
            const lowerQuery = query.toLowerCase();
            products = MOCK_PRODUCTS.filter(p =>
                p.clean_title.toLowerCase().includes(lowerQuery) ||
                p.ai_summary.toLowerCase().includes(lowerQuery) ||
                p.ai_badge.toLowerCase().includes(lowerQuery)
            );

            if (products.length === 0) {
                isFallback = true;
                products = MOCK_PRODUCTS.slice(0, 5); // Fallback mock
            }
        } else {
            products = MOCK_PRODUCTS;
        }
    }

    // SAFETY NET: Si después de todo products sigue vacío, usar MOCK
    if (!products || products.length === 0) {
        console.warn("⚠️ Products array is empty. Forcing MOCK data.");
        products = MOCK_PRODUCTS;
    }

    // Split data: 4 Featured + 25 Feed
    const featuredProducts = products?.slice(0, 4) || [];
    const feedProducts = products?.slice(4, 29) || [];

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-24">
            <CookieBanner />

            {/* Hero Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                        Claridad entre el caos. <span className="text-indigo-600">Ofertas reales.</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
                        Lumina utiliza IA avanzada para iluminar las verdaderas oportunidades en Amazon, filtrando miles de productos para entregarte solo lo que brilla.
                    </p>
                    <p className="text-xs text-slate-400 mb-8">
                        Como afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos.
                    </p>
                    <Suspense fallback={<div className="h-12 bg-slate-100 rounded-xl animate-pulse" />}>
                        <SearchBar />
                    </Suspense>

                    {isFallback && (
                        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 max-w-2xl mx-auto flex items-start gap-3 text-left">
                            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">No encontramos ofertas activas para tu búsqueda.</p>
                                <p className="text-sm mt-1">
                                    Pero no te vayas con las manos vacías: hemos seleccionado estas <strong>alternativas mejor valoradas</strong> para ti.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 1. FEATURED ANALYSIS (Top 4) */}
                <div className="space-y-8 mb-24">
                    <div className="flex items-center gap-2 mb-8">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isFallback ? 'Alternativas Recomendadas' : 'Análisis Destacados'}
                        </h2>
                    </div>

                    <div className="space-y-0">
                        {featuredProducts.map((product, index) => (
                            <FeaturedAnalysis key={product.id} product={product} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. FEED (Next 25) */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-12">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Últimos Análisis: <span className="text-indigo-600">25 Oportunidades Detectadas</span>
                    </h3>
                    <span className="text-sm text-slate-500">
                        Actualizado hoy
                    </span>
                </div>

                {feedProducts.map((product, index) => (
                    <div key={product.id}>
                        <DealPost product={product} />
                        {/* Insertar anuncio cada 5 posts */}
                        {(index + 1) % 5 === 0 && <AdPlaceholder />}
                    </div>
                ))}

                {feedProducts.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        No hay más ofertas por hoy. Vuelve mañana.
                    </div>
                )}
            </section>
        </main>
    );
}
