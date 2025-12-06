'use client';

import { SparkAreaChart } from '@tremor/react';
import { ExternalLink, Tag } from 'lucide-react';

interface ProductProps {
    product: {
        clean_title: string;
        original_price: number;
        current_price: number;
        discount_percentage: number;
        ai_summary: string;
        ai_badge: string;
        sales_phrase: string;
        image_url: string;
        product_url: string;
        price_history: any[]; // Array from JSONB
    };
}

const getAffiliateUrl = (url: string) => {
    try {
        const urlObj = new URL(url);
        // Aquí pondrás tu TAG de afiliado real cuando lo tengas
        // Ejemplo: urlObj.searchParams.set("tag", "lumina-20");
        urlObj.searchParams.set("tag", "lumina-demo-20"); // Placeholder
        return urlObj.toString();
    } catch (e) {
        return url;
    }
};

export default function ProductCard({ product }: ProductProps) {
    // Transformar historial para Tremor
    const chartdata = product.price_history?.map((item: any) => ({
        date: item.date,
        Price: item.price,
    })) || [];

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Badge Flotante IA */}
            <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm border border-indigo-200 backdrop-blur-md bg-opacity-90">
                    {product.ai_badge || '✨ AI Pick'}
                </span>
            </div>

            {/* Imagen del Producto */}
            <div className="relative h-56 bg-white p-6 flex items-center justify-center overflow-hidden">
                {/* Usamos mix-blend-multiply para que el fondo blanco de la imagen se funda con el div */}
                <img
                    src={product.image_url || 'https://placehold.co/400x400?text=No+Image'}
                    alt={product.clean_title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x400?text=No+Image';
                        e.currentTarget.onerror = null; // Previene loop infinito
                    }}
                />

                {/* Overlay Gradiente al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-5">
                {/* Título y Resumen */}
                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-2">
                    {product.clean_title}
                </h3>

                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {product.ai_summary}
                </p>

                {/* Sección de Sparkline (Historial de Precios) */}
                <div className="mb-4 h-16">
                    <p className="text-xs text-slate-400 mb-1">Historial 30 días</p>
                    <SparkAreaChart
                        data={chartdata}
                        categories={["Price"]}
                        index="date"
                        colors={["emerald"]}
                        className="h-10 w-full"
                    />
                </div>

                {/* Bloque de Venta / Sales Phrase */}
                <div className="mb-4 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {product.sales_phrase}
                    </p>
                </div>

                {/* Footer: Precios y CTA */}
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-slate-400 line-through decoration-red-400">
                                ${product.original_price}
                            </span>
                            <span className="text-2xl font-black text-slate-900 tracking-tight">
                                ${product.current_price}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            -{product.discount_percentage}% OFF
                        </span>
                    </div>

                    <a
                        href={getAffiliateUrl(product.product_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all duration-300"
                    >
                        Ver Oferta
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
