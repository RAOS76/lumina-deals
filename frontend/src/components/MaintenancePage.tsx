import React from 'react';
import { Construction, Sparkles } from 'lucide-react';

export default function MaintenancePage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                        <Construction className="w-12 h-12 text-indigo-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    En Construcción
                </h1>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-indigo-600 tracking-wide uppercase">
                        Lumina Ofertas
                    </span>
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                    Estamos trabajando en algo extraordinario. Nuestra inteligencia artificial está afinando los últimos detalles para traerte las mejores ofertas.
                </p>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                    <div className="bg-indigo-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
                <p className="text-xs text-slate-400">
                    Lanzamiento muy pronto.
                </p>
            </div>
        </main>
    );
}
