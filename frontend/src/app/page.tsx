
import { createClient } from '@supabase/supabase-js';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { Sparkles } from 'lucide-react';
import { Suspense } from 'react';

// Inicializar cliente Supabase (usando vars públicas para el cliente)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Inicialización segura: si faltan keys, supabase será null (evita crash en build)
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Revalidate cada hora (ISR)
export const revalidate = 3600;

export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams?.q || '';

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
            product_url: '#',
            price_history: [
                { date: '2023-11-01', price: 399.99 },
                { date: '2023-11-10', price: 348.00 },
                { date: '2023-11-20', price: 298.00 },
                { date: '2023-12-01', price: 298.00 }
            ]
        },
        // ... (otros mocks omitidos por brevedad, se usarán los originales del file si no se tocan)
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
            queryBuilder = queryBuilder.ilike('clean_title', `%${query}%`);
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;
        products = data;
    } catch (err) {
        console.warn("⚠️ Usando MOCK DATA (Supabase no conectado o error):", err);
        products = MOCK_PRODUCTS;
    }

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header Minimalista */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            LUMINA
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 hidden sm:block">
                        El arte de encontrar lo extraordinario
                    </p>
                </div>
            </header>

            {/* Hero Section Simple */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                    Claridad entre el caos. <span className="text-indigo-600">Ofertas reales.</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                    Lumina utiliza IA avanzada para iluminar las verdaderas oportunidades en Amazon, filtrando miles de productos para entregarte solo lo que brilla.
                </p>
                <Suspense fallback={<div className="h-12 bg-slate-100 rounded-xl animate-pulse" />}>
                    <SearchBar />
                </Suspense>
            </section>

            {/* Grid de Productos */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {(!products || products.length === 0) && (
                    <div className="text-center py-20 text-slate-400">
                        No hay ofertas activas en este momento. Vuelve pronto.
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
                <p>© {new Date().getFullYear()} Lumina. Powered by Intelligence.</p>
            </footer>
        </main>
    );
}
