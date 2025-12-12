'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600 flex-1">
                    <p>
                        Usamos cookies para mejorar tu experiencia y mostrar anuncios relevantes.
                        Al continuar navegando, aceptas nuestra <a href="/privacy" className="text-indigo-600 underline hover:text-indigo-800">Política de Privacidad</a>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-slate-400 hover:text-slate-600 md:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                        Aceptar Todo
                    </button>
                </div>
            </div>
        </div>
    );
}
