import React from 'react';

export default function AdPlaceholder() {
    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px] my-8">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Publicidad</span>
            <div className="w-full max-w-[728px] h-[90px] bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                Espacio para Google AdSense
            </div>
        </div>
    );
}
