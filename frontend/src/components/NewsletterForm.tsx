'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('¡Gracias por suscribirte!');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Algo salió mal.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Error de conexión.');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-4">
                    <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No te pierdas ninguna oferta</h3>
                <p className="text-gray-400 text-sm">
                    Recibe las mejores ofertas seleccionadas por IA directamente en tu correo. Sin spam.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        disabled={status === 'loading' || status === 'success'}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Suscribiendo...
                        </>
                    ) : status === 'success' ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            ¡Suscrito!
                        </>
                    ) : (
                        'Suscribirme'
                    )}
                </button>

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm justify-center mt-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{message}</span>
                    </div>
                )}

                {status === 'success' && (
                    <p className="text-green-400 text-sm text-center mt-2">{message}</p>
                )}
            </form>
        </div>
    );
}
