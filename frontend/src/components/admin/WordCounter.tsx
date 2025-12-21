'use client';

interface WordCounterProps {
    content: string;
}

export default function WordCounter({ content }: WordCounterProps) {
    // Strip HTML tags and count words
    const stripHtml = (html: string) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const text = stripHtml(content);
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Calculate reading time (250 words per minute)
    const readingTime = Math.max(1, Math.ceil(wordCount / 250));

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-semibold text-slate-700">
                    {wordCount.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">
                    {wordCount === 1 ? 'palabra' : 'palabras'}
                </span>
            </div>

            <div className="w-px h-4 bg-slate-200" />

            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-slate-700">
                    {readingTime}
                </span>
                <span className="text-xs text-slate-400">
                    min lectura
                </span>
            </div>
        </div>
    );
}
