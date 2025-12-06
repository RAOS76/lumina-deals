'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce'; // Vamos a instalar esto o hacerlo manual

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [text, setText] = useState(initialQuery);
    const [query] = useDebounce(text, 300);

    useEffect(() => {
        if (query === initialQuery) return; // Evitar loop inicial

        const params = new URLSearchParams(searchParams);
        if (query) {
            params.set('q', query);
        } else {
            params.delete('q');
        }
        router.replace(`/?${params.toString()}`);
    }, [query, router, searchParams, initialQuery]);

    return (
        <div className="relative w-full max-w-xl mx-auto mb-8">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm shadow-sm transition-all duration-200"
                    placeholder="Buscar ofertas (ej: auriculares, laptop...)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
        </div>
    );
}
