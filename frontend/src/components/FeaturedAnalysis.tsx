import Link from 'next/link';
import { Sparkles, ArrowRight, Brain, Star, Check, X } from 'lucide-react';
import { productAnalyses } from '@/lib/productAnalyses';

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
    const hasDetailedAnalysis = !!productAnalyses[product.slug];
    const analysis = productAnalyses[product.slug];

    // Standard compact view for products without detailed analysis
    if (!hasDetailedAnalysis) {
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
                            <span className="text-sm text-slate-400 line-through">${Number(product.original_price).toFixed(2)}</span>
                            <span className="text-3xl font-bold text-slate-900">${Number(product.current_price).toFixed(2)}</span>
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

    // Enhanced view for products with detailed analysis
    return (
        <div className="py-12 border-b border-slate-100 last:border-0">
            <div className={`flex flex-col md:flex-row${isReversed ? '-reverse' : ''} items-start gap-8 md:gap-12 mb-8`}>
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
                        {/* Rating Badge */}
                        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                            <Star className="w-4 h-4 fill-white" />
                            {analysis.rating}/10
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 text-left space-y-6">
                    <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                            ⭐ Análisis Completo
                        </span>
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                            {product.category}
                        </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                        {product.clean_title}
                    </h3>

                    <div className="prose prose-slate text-base text-slate-600">
                        <p className="leading-relaxed">
                            {product.ai_summary}
                        </p>
                    </div>

                    {/* Quick Highlights */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Destacados</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {analysis.keyFeatures.slice(0, 3).map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-400 line-through">${Number(product.original_price).toFixed(2)}</span>
                            <span className="text-3xl font-bold text-slate-900">${Number(product.current_price).toFixed(2)}</span>
                        </div>

                        <Link
                            href={`/deal/${product.slug}`}
                            className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Ver Análisis Completo
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Pros & Cons Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {/* Top 3 Pros */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Lo Mejor
                    </h4>
                    <ul className="space-y-2">
                        {analysis.prosAndCons.pros.slice(0, 3).map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-green-900">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0 mt-1.5" />
                                {pro}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Top 2 Cons */}
                <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-6 border border-rose-100">
                    <h4 className="text-sm font-bold text-rose-900 mb-3 flex items-center gap-2">
                        <X className="w-4 h-4" />
                        A Considerar
                    </h4>
                    <ul className="space-y-2">
                        {analysis.prosAndCons.cons.slice(0, 2).map((con, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-rose-900">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0 mt-1.5" />
                                {con}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Verdict Preview */}
            <div className="mt-6 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
                <h4 className="text-sm font-bold mb-2 uppercase tracking-wide opacity-90">Veredicto</h4>
                <p className="text-sm leading-relaxed opacity-95 line-clamp-2">
                    {analysis.verdict}
                </p>
            </div>
        </div>
    );
}
