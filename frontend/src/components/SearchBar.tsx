'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce'; // Vamos a instalar esto o hacerlo manual

export default function SearchBar({ showButton = false }: { showButton?: boolean }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [text, setText] = useState(initialQuery);
    const [query] = useDebounce(text, 600);
    const lastQueryRef = useRef(initialQuery);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (text) {
            params.set('q', text);
        } else {
            params.delete('q');
        }
        lastQueryRef.current = text; // Update ref
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        // Safety check: If query hasn't changed from what we last processed, skip.
        // This prevents loops where URL update triggers effect which triggers URL update.
        if (query === lastQueryRef.current) return;

        const params = new URLSearchParams(searchParams);
        if (query) {
            params.set('q', query);
        } else {
            params.delete('q');
        }

        lastQueryRef.current = query; // Update ref
        router.replace(`/?${params.toString()}`, { scroll: false });
    }, [query, router, searchParams]); // Removed initialQuery from deps

    return (
        <div className={`relative w-full max-w-xl mx-auto ${showButton ? '' : 'mb-8'}`}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-24 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-base shadow-lg shadow-slate-200/50 transition-all duration-300"
                    placeholder="Buscar ofertas (ej: auriculares, laptop...)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {showButton && (
                    <div className="absolute inset-y-0 right-2 flex items-center" style={{ right: '8px' }}>
                        <button
                            onClick={handleSearch}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-indigo-500/30 active:scale-95 z-10"
                        >
                            Buscar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
