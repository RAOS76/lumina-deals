'use client';

import { useState } from 'react';
import { Mail, X, Send, Loader2, Check } from 'lucide-react';

export default function FloatingNewsletter() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus('success');
                setEmail('');
                setTimeout(() => {
                    setIsOpen(false);
                    setStatus('idle');
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-[50] bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 group"
                aria-label="Suscribirse al newsletter"
            >
                <Mail className="w-6 h-6" />
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Ofertas Top
                </span>
            </button>
        );
    }

    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[50] w-72 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-5 transition-all animate-in slide-in-from-left-5 duration-300">
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Ofertas Exclusivas</h3>
                    <p className="text-xs text-gray-400">Las mejores gangas, cada semana.</p>
                </div>
            </div>

            {status === 'success' ? (
                <div className="bg-green-500/20 text-green-400 p-3 rounded-xl flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4" />
                    <span>¡Suscrito correctamente!</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                Suscribirme <Send className="w-3 h-3" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
