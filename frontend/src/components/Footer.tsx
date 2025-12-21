import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Newsletter Section */}
                <div className="mb-12 max-w-md mx-auto">
                    <NewsletterForm />
                </div>

                {/* Company Info */}
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                        Lumina Ofertas
                    </h2>
                    <p className="text-gray-400 mb-4">
                        Tu curador de ofertas impulsado por Inteligencia Artificial. Analizamos miles de productos para traerte solo lo mejor.
                    </p>
                    <p className="text-xs text-gray-500">
                        Como afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos.
                    </p>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-8 text-center md:text-left">
                    <p className="text-gray-500 text-sm mb-4">
                        © {new Date().getFullYear()} Lumina Ofertas. Todos los derechos reservados.
                    </p>
                    <div className="flex justify-center md:justify-start gap-6">
                        <Link href="/privacy" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                            Política de Privacidad
                        </Link>
                        <Link href="/terms" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                            Términos de Uso
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
