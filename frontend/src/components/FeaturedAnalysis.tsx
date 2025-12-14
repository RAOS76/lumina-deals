import Link from 'next/link';
import { Sparkles, ArrowRight, Brain } from 'lucide-react';

interface Product {
    id: string;
    slug: string;
    clean_title: string;
    ai_summary: string;
    image_url: string;
    current_price: number;
    original_price: number;
    discount_percentage: number;
    category: string;
    lumina_score?: number;
}

export default function FeaturedAnalysis({ product, index }: { product: Product; index: number }) {
    const isReversed = index % 2 !== 0;

    return (
        <div className={`flex flex-col md:flex-row${isReversed ? '-reverse' : ''} items-center gap-8 md:gap-12 py-12 border-b border-slate-100 last:border-0`}>
            {/* Image Side */}
            <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={product.image_url}
                        alt={product.clean_title}
                        className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.discount_percentage > 0 && (
                        <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            -{product.discount_percentage}%
                        </div>
                    )}
                    {product.lumina_score && (
                        <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            Score: {product.lumina_score}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 text-left space-y-6">
                <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                        {product.category || 'Análisis Destacado'}
                    </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                    {product.clean_title}
                </h3>

                <div className="prose prose-slate text-lg text-slate-600">
                    <p className="line-clamp-4 leading-relaxed">
                        {product.ai_summary}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-400 line-through">${product.original_price}</span>
                        <span className="text-3xl font-bold text-slate-900">${product.current_price}</span>
                    </div>

                    <Link
                        href={`/deal/${product.slug}`}
                        className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Leer Análisis
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
