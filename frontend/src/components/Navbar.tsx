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
            <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
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
                            <Link href="/blog" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                                Blog
                            </Link>
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

                {/* Mobile Menu Overlay - Full Screen Premium Design */}
                <div
                    className={`md:hidden fixed inset-0 z-[100] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    style={{
                        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
                    }}
                >
                    {/* Internal Mobile Header with Gradient */}
                    <div className="flex justify-between items-center px-6 h-20 border-b border-white/10 bg-gradient-to-r from-indigo-600/10 to-violet-600/10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg blur opacity-50"></div>
                                <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                LUMINA
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-xl text-white hover:bg-white/10 transition-all active:scale-95"
                        >
                            <X className="w-7 h-7" />
                        </button>
                    </div>

                    <div className="h-[calc(100vh-80px)] overflow-y-auto">
                        <div className="px-6 py-8 space-y-1">
                            {CATEGORIES.map((category, idx) => (
                                <div key={category.slug} className="mb-2">
                                    <button
                                        onClick={() => setActiveCategory(activeCategory === category.slug ? null : category.slug)}
                                        className="w-full flex items-center justify-between py-5 px-4 text-left group rounded-2xl hover:bg-white/5 transition-all"
                                    >
                                        <span className={`text-xl font-bold transition-all ${activeCategory === category.slug ? 'text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text' : 'text-white'}`}>
                                            {category.name}
                                        </span>
                                        <ChevronDown
                                            className={`w-6 h-6 transition-all duration-300 ${activeCategory === category.slug ? 'rotate-180 text-indigo-400' : 'text-gray-500'}`}
                                        />
                                    </button>

                                    <div className={`grid gap-3 overflow-hidden transition-all duration-300 ease-in-out ${activeCategory === category.slug ? 'max-h-[500px] opacity-100 mt-2 mb-4' : 'max-h-0 opacity-0'}`}>
                                        {category.subcategories.map((sub) => (
                                            <Link
                                                key={sub.slug}
                                                href={`/category/${category.slug}/${sub.slug}`}
                                                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] hover:from-indigo-600/20 hover:to-violet-600/20 active:scale-[0.97] transition-all border border-white/10 hover:border-indigo-500/30 ml-4"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="text-gray-200 font-semibold text-base">{sub.name}</span>
                                                <span className="text-indigo-400 text-lg">→</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Blog Link */}
                        <div className="px-6 pb-4">
                            <Link
                                href="/blog"
                                className="flex items-center justify-between py-5 px-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] hover:from-indigo-600/20 hover:to-violet-600/20 border border-white/10 hover:border-indigo-500/30 transition-all active:scale-[0.97]"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="text-xl font-bold text-white">Blog</span>
                                <span className="text-indigo-400 text-xl">→</span>
                            </Link>
                        </div>

                        {/* Newsletter CTA */}
                        <div className="px-6 pb-8 pt-4">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsNewsletterOpen(true);
                                }}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/20 transition-all active:scale-[0.97] flex items-center justify-center gap-3"
                            >
                                <span className="text-2xl">📩</span>
                                <span>Suscríbete al Newsletter</span>
                            </button>
                        </div>

                        {/* Version Indicator (Temporary) */}
                        <div className="px-6 pb-8">
                            <p className="text-center text-xs text-gray-600 font-mono">
                                v0.1.12-PREMIUM
                            </p>
                        </div>
                    </div>
                </div>
            </header >

            {/* Newsletter Modal */}
            {
                isNewsletterOpen && (
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
                )
            }
        </>
    );
}
