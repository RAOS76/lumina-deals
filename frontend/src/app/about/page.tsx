import React from 'react';
import { Sparkles, Brain, ShoppingBag } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Sobre Lumina Ofertas</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Donde la Inteligencia Artificial se encuentra con las compras inteligentes.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Curación por IA</h3>
                    <p className="text-slate-600 text-sm">
                        Nuestros algoritmos analizan miles de productos diariamente para encontrar verdaderas oportunidades, no solo descuentos falsos.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Ahorro Real</h3>
                    <p className="text-slate-600 text-sm">
                        Nos enfocamos en la calidad y el valor histórico. Si un producto no es bueno, no lo recomendamos, sin importar el precio.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Transparencia</h3>
                    <p className="text-slate-600 text-sm">
                        Somos claros sobre cómo operamos. Ganamos comisiones de afiliados que nos permiten mantener esta tecnología gratuita para ti.
                    </p>
                </div>
            </div>

            <div className="prose prose-slate mx-auto">
                <h2>Nuestra Misión</h2>
                <p>
                    En un mundo saturado de "ofertas" que no lo son, Lumina nació con una misión simple: traer claridad al caos del comercio electrónico.
                    Utilizamos tecnología avanzada para filtrar el ruido y presentarte solo aquellos productos que realmente valen tu tiempo y dinero.
                </p>
                <p>
                    No somos solo un agregador de enlaces. Somos tu asistente de compras inteligente, trabajando 24/7 para asegurar que nunca pagues de más.
                </p>
            </div>
        </main>
    );
}
