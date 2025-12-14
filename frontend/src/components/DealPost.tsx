'use client';

import Link from 'next/link';
import { SparkAreaChart } from '@tremor/react';
import { ExternalLink, Tag, TrendingDown, Clock, Sparkles, Brain, ShoppingBag } from 'lucide-react';
import { getAffiliateUrl } from '@/lib/utils';

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
        price_history: any[];
        rating?: number;
        review_count?: number;
        lumina_score?: number;
        slug?: string;
        category?: string;
    };
}

export default function DealPost({ product }: ProductProps) {
    const dealUrl = product.slug ? `/deal/${product.slug}` : '#';

    return (
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="grid md:grid-cols-12 gap-0">

                {/* Image Section (4 cols) */}
                <div className="md:col-span-4 bg-white p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative group">
                    <Link href={dealUrl} className="block w-full h-full">
                        <img
                            src={product.image_url || 'https://placehold.co/600x600?text=No+Image'}
                            alt={product.clean_title}
                            className="w-full h-48 md:h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image';
                                e.currentTarget.onerror = null;
                            }}
                        />
                    </Link>
                    {product.discount_percentage > 0 && (
                        <div className="absolute top-4 left-4 bg-rose-500 text-white px-2 py-1 rounded-lg text-sm font-bold shadow-sm flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            -{product.discount_percentage}%
                        </div>
                    )}
                </div>

                {/* Content Section (8 cols) */}
                <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                {product.ai_badge}
                            </span>
                            <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {product.category}
                            </span>
                        </div>

                        <Link href={dealUrl} className="group">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
                                {product.clean_title}
                            </h2>
                        </Link>

                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Detectado hoy
                            </span>
                            {product.lumina_score && (
                                <span className="flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                    Lumina Score: {product.lumina_score}/100
                                </span>
                            )}
                        </div>

                        {/* Rating Section */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-600">
                                {product.rating} ({product.review_count?.toLocaleString()} reviews)
                            </span>
                        </div>

                        <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                            {product.ai_summary}
                        </p>
                    </div>

                    <div className="flex items-end justify-between mt-4 md:mt-0">
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-400 mb-1">Mejor precio histórico</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-900">
                                    ${product.current_price.toFixed(2)}
                                </span>
                                {product.original_price > product.current_price && (
                                    <span className="text-lg text-slate-400 line-through">
                                        ${product.original_price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={dealUrl}
                                className="px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
                            >
                                <Brain className="w-4 h-4" />
                                Ver Análisis
                            </Link>
                            <a
                                href={getAffiliateUrl(product.product_url)}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="px-5 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Ver en Amazon
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
