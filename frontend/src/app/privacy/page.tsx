import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Política de Privacidad</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">
                    Última actualización: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">1. Introducción</h2>
                    <p className="text-slate-600">
                        En LUMINA ("nosotros", "nuestro"), respetamos su privacidad y nos comprometemos a proteger sus datos personales.
                        Esta política de privacidad explica cómo recopilamos, usamos y protegemos su información cuando visita nuestro sitio web.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">2. Información que recopilamos</h2>
                    <p className="text-slate-600 mb-4">
                        Podemos recopilar la siguiente información:
                    </p>
                    <ul className="list-disc pl-5 text-slate-600 space-y-2">
                        <li>Información de contacto (correo electrónico) si se suscribe a nuestro boletín.</li>
                        <li>Datos de navegación y uso del sitio web a través de cookies.</li>
                        <li>Información técnica como su dirección IP y tipo de navegador.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">3. Uso de la información</h2>
                    <p className="text-slate-600 mb-4">
                        Utilizamos su información para:
                    </p>
                    <ul className="list-disc pl-5 text-slate-600 space-y-2">
                        <li>Enviarle ofertas y actualizaciones si se ha suscrito.</li>
                        <li>Mejorar nuestro sitio web y la experiencia del usuario.</li>
                        <li>Analizar tendencias y estadísticas de uso.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">4. Cookies y Publicidad</h2>
                    <p className="text-slate-600 mb-4">
                        Utilizamos cookies para mejorar su experiencia. Además, utilizamos servicios de terceros como Google AdSense para mostrar anuncios.
                    </p>
                    <p className="text-slate-600 mb-4">
                        Google utiliza cookies para mostrar anuncios basados en sus visitas anteriores a este y otros sitios web.
                        Los usuarios pueden inhabilitar la publicidad personalizada visitando la Configuración de anuncios de Google.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">5. Enlaces de Afiliados</h2>
                    <p className="text-slate-600">
                        LUMINA participa en el Programa de Afiliados de Amazon Services LLC, un programa de publicidad de afiliados diseñado para proporcionar un medio para que los sitios ganen tarifas de publicidad mediante publicidad y enlaces a Amazon.com.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">6. Contacto</h2>
                    <p className="text-slate-600">
                        Si tiene preguntas sobre esta política de privacidad, puede contactarnos a través de nuestro formulario de contacto o enviando un correo a info@lumina.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
