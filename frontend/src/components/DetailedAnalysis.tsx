'use client';

import { Check, X, Star } from 'lucide-react';

interface DetailedAnalysisProps {
    slug: string;
    analysis: {
        fullAnalysis: string;
        keyFeatures: string[];
        prosAndCons: {
            pros: string[];
            cons: string[];
        };
        verdict: string;
        rating: number;
    };
}

export default function DetailedAnalysis({ slug, analysis }: DetailedAnalysisProps) {
    return (
        <div className="mt-12 space-y-8">
            {/* Rating Badge */}
            <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2">
                    <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                    <span className="text-5xl font-black text-slate-900">{analysis.rating}</span>
                    <span className="text-2xl text-slate-400">/10</span>
                </div>
                <div className="h-12 w-px bg-slate-200" />
                <div className="text-left">
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">Puntuación Lumina</p>
                    <p className="text-xs text-slate-500">Basado en análisis técnico y pruebas reales</p>
                </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="text-indigo-600">✨</span>
                    Características Principales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-sm text-slate-700 leading-relaxed">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Analysis */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100">
                <h3 className="text-3xl font-bold text-slate-900 mb-8">Análisis Completo</h3>
                <div
                    className="prose prose-lg prose-slate max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                        prose-ul:my-4 prose-li:text-slate-600
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-table:border-collapse prose-table:w-full
                        prose-th:bg-slate-100 prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:text-slate-900
                        prose-td:p-3 prose-td:border-t prose-td:border-slate-200
                        prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: analysis.fullAnalysis }}
                />
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                    <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                        <Check className="w-6 h-6" />
                        Ventajas
                    </h3>
                    <ul className="space-y-3">
                        {analysis.prosAndCons.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm text-green-900 leading-relaxed">{pro}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cons */}
                <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-8 border border-rose-100">
                    <h3 className="text-2xl font-bold text-rose-900 mb-6 flex items-center gap-2">
                        <X className="w-6 h-6" />
                        Desventajas
                    </h3>
                    <ul className="space-y-3">
                        {analysis.prosAndCons.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <X className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm text-rose-900 leading-relaxed">{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Final Verdict */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Veredicto Final</h3>
                <p className="text-lg leading-relaxed opacity-95">
                    {analysis.verdict}
                </p>
            </div>
        </div>
    );
}
