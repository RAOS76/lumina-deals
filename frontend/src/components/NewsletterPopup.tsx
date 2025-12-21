'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function NewsletterPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('lumina_newsletter_v2');
        if (hasSeenPopup) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Show after scrolling 20% of the page
            // But hide if we are near the bottom (where the footer is)
            const isNearBottom = scrollY + windowHeight > documentHeight - 600;
            const hasScrolledEnough = scrollY > windowHeight * 0.2;

            if (hasScrolledEnough && !isNearBottom && !shouldRender) {
                setShouldRender(true);
                setTimeout(() => setIsVisible(true), 100);
            } else if (isNearBottom && isVisible) {
                setIsVisible(false);
                setTimeout(() => setShouldRender(false), 300);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [shouldRender, isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setShouldRender(false), 300); // Wait for animation
        localStorage.setItem('lumina_newsletter_v2', 'true');
    };

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-lg transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
                    {/* Decorative Gradient Blob */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-4">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Ofertas Exclusivas</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                ¡Bienvenido a Lumina!
                            </h2>
                            <p className="text-slate-400 leading-relaxed">
                                Únete a nuestra comunidad y recibe cada semana las 5 mejores ofertas tecnológicas seleccionadas por IA.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="relative z-10">
                            <NewsletterForm />
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleClose}
                                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                No gracias, prefiero buscar manualmente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
