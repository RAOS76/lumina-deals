'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Sparkles, Menu, X, ChevronDown, Search } from 'lucide-react'; // Added Search icon import
import NewsletterForm from './NewsletterForm';
import SearchBar from './SearchBar'; // Added SearchBar import

const CATEGORIES = [
    {
        name: 'Tecnología',
        slug: 'tecnologia',
        description: 'Innovación que justifica su precio.',
        subcategories: [
            { name: 'Audio Premium', slug: 'audio' },
            { name: 'Computación', slug: 'computacion' },
            { name: 'Gadgets', slug: 'gadgets' },
            { name: 'Fotografía', slug: 'fotografia' },
        ],
    },
    {
        name: 'Hogar',
        slug: 'hogar',
        description: 'Tu espacio, optimizado.',
        subcategories: [
            { name: 'Cocina', slug: 'cocina' },
            { name: 'Domótica', slug: 'domotica' },
            { name: 'Limpieza', slug: 'limpieza' },
            { name: 'Decoración', slug: 'decoracion' },
        ],
    },
    {
        name: 'Gaming',
        slug: 'gaming',
        description: 'Rendimiento sin compromisos.',
        subcategories: [
            { name: 'Consolas', slug: 'consolas' },
            { name: 'PC Gaming', slug: 'pc-gaming' },
            { name: 'Accesorios', slug: 'accesorios' },
            { name: 'Juegos', slug: 'juegos' },
        ],
    },
    {
        name: 'Salud',
        slug: 'salud',
        description: 'Inversiones en ti mismo.',
        subcategories: [
            { name: 'Cuidado Personal', slug: 'cuidado-personal' },
            { name: 'Deporte', slug: 'deporte' },
        ],
    },
    {
        name: 'Oficina',
        slug: 'oficina',
        description: 'Diseña tu flujo de trabajo.',
        subcategories: [
            { name: 'Muebles', slug: 'muebles' },
            { name: 'Periféricos', slug: 'perifericos' },
            { name: 'Accesorios', slug: 'accesorios' },
        ],
    },
    {
        name: 'Moda',
        slug: 'moda',
        description: 'Estilo inteligente.',
        subcategories: [
            { name: 'Accesorios', slug: 'accesorios' },
            { name: 'Calzado', slug: 'calzado' },
        ],
    },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // New state
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <>
            <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-slate-200/50 shadow-sm supports-[backdrop-filter]:bg-white/60">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    LUMINA
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-1">
                            {CATEGORIES.map((category) => (
                                <div
                                    key={category.slug}
                                    className="relative group px-3"
                                    onMouseEnter={() => setActiveCategory(category.slug)}
                                    onMouseLeave={() => setActiveCategory(null)}
                                >
                                    <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 py-2 transition-colors">
                                        {category.name}
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeCategory === category.slug ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                                    </button>

                                    {/* Mega Menu Dropdown */}
                                    <div className={`absolute left-1/2 -translate-x-1/2 w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100/50 transition-all duration-300 transform origin-top top-full mt-2 ${activeCategory === category.slug ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                        <div className="p-5">
                                            <div className="mb-4 pb-3 border-b border-slate-100">
                                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                                                    {category.name}
                                                </p>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    {category.description}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                {category.subcategories.map((sub) => (
                                                    <Link
                                                        key={sub.slug}
                                                        href={`/category/${category.slug}/${sub.slug}`}
                                                        className="group/item flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-50/80 transition-all duration-200"
                                                    >
                                                        <span className="text-sm font-medium text-slate-700 group-hover/item:text-indigo-700">
                                                            {sub.name}
                                                        </span>
                                                        <span className="opacity-0 group-hover/item:opacity-100 transform translate-x-[-4px] group-hover/item:translate-x-0 transition-all duration-200 text-indigo-500">
                                                            →
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`p-2 rounded-full transition-all ${isSearchOpen ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                            >
                                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={() => setIsNewsletterOpen(true)}
                                className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                            >
                                Suscríbete
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-slate-600 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Search Bar Dropdown */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'max-h-32 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                        <div className="pt-2">
                            <Suspense fallback={<div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />}>
                                <SearchBar showButton={true} />
                            </Suspense>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Overlay */}
                <div className={`md:hidden fixed inset-0 z-40 bg-slate-100 border-t border-slate-200 shadow-inner transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} top-20`}>
                    <div className="h-full overflow-y-auto pb-32">
                        <div className="px-4 py-6 space-y-2">
                            {CATEGORIES.map((category) => (
                                <div key={category.slug} className="border-b border-slate-100 last:border-0">
                                    <button
                                        onClick={() => setActiveCategory(activeCategory === category.slug ? null : category.slug)}
                                        className="w-full flex items-center justify-between py-4 text-left group"
                                    >
                                        <span className={`text-lg font-bold transition-colors ${activeCategory === category.slug ? 'text-indigo-600' : 'text-slate-900'}`}>
                                            {category.name}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeCategory === category.slug ? 'rotate-180 text-indigo-600' : ''}`}
                                        />
                                    </button>

                                    <div className={`grid gap-2 overflow-hidden transition-all duration-300 ease-in-out ${activeCategory === category.slug ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                        {category.subcategories.map((sub) => (
                                            <Link
                                                key={sub.slug}
                                                href={`/category/${category.slug}/${sub.slug}`}
                                                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 active:bg-indigo-50 active:scale-[0.98] transition-all"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="text-slate-600 font-medium">{sub.name}</span>
                                                <span className="text-slate-300">→</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sticky Bottom Actions */}
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 pb-8">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsNewsletterOpen(true);
                                }}
                                className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">📩</span>
                                Suscríbete al Newsletter
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Newsletter Modal */}
            {isNewsletterOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsNewsletterOpen(false)}
                    />
                    <div className="relative w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">
                        <button
                            onClick={() => setIsNewsletterOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="p-1">
                            <NewsletterForm />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
