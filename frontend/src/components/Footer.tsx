import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                            Lumina Ofertas
                        </h2>
                        <p className="text-gray-400 max-w-md">
                            Tu curador de ofertas impulsado por Inteligencia Artificial. Analizamos miles de productos para traerte solo lo mejor.
                        </p>
                    </div>
                    <div>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Lumina Ofertas. Todos los derechos reservados.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
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
