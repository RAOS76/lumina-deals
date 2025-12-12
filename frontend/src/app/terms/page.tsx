import React from 'react';

export default function TermsPage() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
            <h1>Términos y Condiciones</h1>
            <p>Última actualización: {new Date().toLocaleDateString()}</p>

            <h2>1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar Lumina Ofertas, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.</p>

            <h2>2. Uso del Sitio</h2>
            <p>El contenido de este sitio es solo para información general y uso. Está sujeto a cambios sin previo aviso.</p>

            <h2>3. Propiedad Intelectual</h2>
            <p>Este sitio web contiene material que es propiedad nuestra o tiene licencia para nosotros. Este material incluye, pero no se limita a, el diseño, la apariencia y los gráficos.</p>

            <h2>4. Enlaces a Terceros</h2>
            <p>Nuestro sitio puede contener enlaces a sitios web de terceros (como Amazon) que no son propiedad ni están controlados por nosotros. No tenemos control sobre, y no asumimos responsabilidad por, el contenido, las políticas de privacidad o las prácticas de sitios web de terceros.</p>

            <h2>5. Limitación de Responsabilidad</h2>
            <p>En ningún caso Lumina Ofertas será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, que surjan de su uso del sitio.</p>
        </main>
    );
}
