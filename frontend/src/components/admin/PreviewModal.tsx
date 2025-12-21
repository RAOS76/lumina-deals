'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        title: string;
        content: string;
        coverImage?: string;
        excerpt?: string;
        createdAt?: string;
    };
}

export default function PreviewModal({ isOpen, onClose, post }: PreviewModalProps) {
    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-sm overflow-y-auto">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="fixed top-6 right-6 z-[201] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
                title="Cerrar (ESC)"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Preview Badge and Close Button */}
            <div className="fixed top-6 left-6 z-[201] flex items-center gap-3">
                <div className="px-4 py-2 bg-indigo-600 rounded-full text-white text-sm font-bold shadow-lg">
                    Vista Previa
                </div>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg transition-all inline-flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Cerrar
                </button>
            </div>

            {/* Article Preview */}
            <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 pt-24 pb-20">
                <main className="pt-8">
                    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <header className="text-center mb-12">
                            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-6">
                                <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : new Date().toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                                {post.title || 'Sin título'}
                            </h1>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-md">
                                    <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900">Equipo Lumina</p>
                                    <p className="text-xs text-slate-500">Editor</p>
                                </div>
                            </div>
                        </header>

                        {/* Cover Image */}
                        {post.coverImage && (
                            <div className="max-w-2xl mx-auto mb-12">
                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-lg prose-slate mx-auto prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-img:rounded-xl prose-img:shadow-lg bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100"
                            dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-slate-400">Sin contenido</p>' }}
                        />

                        {/* Close Button at Bottom */}
                        <div className="mt-12 text-center">
                            <button
                                onClick={onClose}
                                className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg inline-flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cerrar Previsualización
                            </button>
                        </div>
                    </article>
                </main>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Raleway:wght@300;400;500;600;700;800;900&family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400;1,600;1,700;1,900&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
                
                /* Preserve whitespace and indentation */
                .prose p, .prose li, .prose blockquote {
                    white-space: pre-wrap;
                }
                
                /* Better paragraph spacing */
                .prose p {
                    margin-bottom: 1.5em;
                }
            `}</style>
        </div>
    );
}
