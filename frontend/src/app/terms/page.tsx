import React from 'react';

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Términos y Condiciones de Uso</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">
                    Última actualización: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">1. Aceptación de los Términos</h2>
                    <p className="text-slate-600">
                        Al acceder y utilizar el sitio web de LUMINA, usted acepta estar sujeto a estos términos y condiciones.
                        Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">2. Uso del Sitio</h2>
                    <p className="text-slate-600">
                        Este sitio web se proporciona para fines informativos y para ayudar a los usuarios a encontrar ofertas de productos.
                        No garantizamos la disponibilidad, precio o exactitud de las ofertas mostradas, ya que estas dependen de terceros (Amazon).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">3. Propiedad Intelectual</h2>
                    <p className="text-slate-600">
                        Todo el contenido original de este sitio (textos, logotipos, gráficos) es propiedad de LUMINA y está protegido por las leyes de propiedad intelectual.
                        Las imágenes de productos son propiedad de sus respectivos dueños o de Amazon.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">4. Descargo de Responsabilidad</h2>
                    <p className="text-slate-600 mb-4">
                        LUMINA no vende productos directamente. Somos un curador de ofertas.
                        Cualquier transacción se realiza en el sitio web del vendedor (ej. Amazon).
                        No somos responsables de envíos, devoluciones o calidad de los productos.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">5. Modificaciones</h2>
                    <p className="text-slate-600">
                        Nos reservamos el derecho de modificar estos términos en cualquier momento.
                        El uso continuado del sitio tras cualquier cambio constituye su aceptación de los nuevos términos.
                    </p>
                </section>
            </div>
        </div>
    );
}
