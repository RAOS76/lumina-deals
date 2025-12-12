import React from 'react';

export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
            <h1>Política de Privacidad</h1>
            <p>Última actualización: {new Date().toLocaleDateString()}</p>

            <h2>1. Introducción</h2>
            <p>Bienvenido a Lumina Ofertas. Nos comprometemos a proteger su privacidad. Esta política explica cómo recopilamos, usamos y compartimos su información personal cuando visita nuestro sitio web.</p>

            <h2>2. Información que recopilamos</h2>
            <p>Podemos recopilar información sobre usted de varias maneras, incluyendo:</p>
            <ul>
                <li>Información que nos proporciona directamente.</li>
                <li>Información recopilada automáticamente a través de cookies y tecnologías similares.</li>
            </ul>

            <h2>3. Uso de Cookies y Google AdSense</h2>
            <p>Utilizamos cookies para mejorar su experiencia y mostrar anuncios relevantes. Trabajamos con proveedores externos, incluido Google, que utilizan cookies para publicar anuncios basados en sus visitas anteriores a nuestro sitio web o a otros sitios web.</p>
            <p>El uso de cookies de publicidad de Google permite a Google y a sus socios mostrar anuncios a los usuarios basados en sus visitas a sus sitios y/o a otros sitios en Internet.</p>
            <p>Los usuarios pueden inhabilitar la publicidad personalizada visitando <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Configuración de anuncios</a>.</p>

            <h2>4. Enlaces de Afiliados</h2>
            <p>Lumina Ofertas participa en el Programa de Afiliados de Amazon, un programa de publicidad para afiliados diseñado para ofrecer a sitios web un modo de obtener comisiones por publicidad, publicitando e incluyendo enlaces a Amazon.com.</p>

            <h2>5. Contacto</h2>
            <p>Si tiene preguntas sobre esta política, contáctenos a través de nuestro sitio web.</p>
        </main>
    );
}
