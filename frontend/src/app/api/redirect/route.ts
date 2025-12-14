import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Use Edge Runtime for speed

// Configuración de Tags por país (esto debería ir en .env idealmente)
const AMAZON_TAGS: Record<string, string> = {
    'US': process.env.NEXT_PUBLIC_AMAZON_TAG || 'lumina-demo-20',
    'ES': process.env.AMAZON_TAG_ES || 'lumina-es-21',
    'MX': process.env.AMAZON_TAG_MX || 'lumina-mx-21',
    'UK': process.env.AMAZON_TAG_UK || 'lumina-uk-21',
    // Fallback default
    'DEFAULT': process.env.NEXT_PUBLIC_AMAZON_TAG || 'lumina-demo-20'
};

// Mapeo de dominios
const AMAZON_DOMAINS: Record<string, string> = {
    'US': 'amazon.com',
    'ES': 'amazon.es',
    'MX': 'amazon.com.mx',
    'UK': 'amazon.co.uk',
    'DE': 'amazon.de',
    'FR': 'amazon.fr',
    'IT': 'amazon.it',
    'CA': 'amazon.ca'
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    // 1. Detectar País (Vercel Headers)
    const country = (req as any).geo?.country || req.headers.get('x-vercel-ip-country') || 'US';
    console.log(`[GeoRedirect] User from: ${country}`);

    // 2. Determinar Dominio y Tag
    const localDomain = AMAZON_DOMAINS[country] || 'amazon.com';
    const localTag = AMAZON_TAGS[country] || AMAZON_TAGS['DEFAULT'];

    // 3. Construir nueva URL
    let finalUrl = targetUrl;

    try {
        const urlObj = new URL(targetUrl);

        // SECURITY: Whitelist validation to prevent Open Redirects
        // SECURITY: Whitelist validation to prevent Open Redirects
        const allowedDomains = [...Object.values(AMAZON_DOMAINS), 'a.co', 'amzn.to'];
        const isAllowed = allowedDomains.some(domain => urlObj.hostname.includes(domain));

        if (!isAllowed) {
            console.error(`[GeoRedirect] Blocked redirect to unauthorized domain: ${urlObj.hostname}`);
            return new NextResponse('Unauthorized redirect domain', { status: 403 });
        }

        // Si es un enlace de Amazon (largo o corto)
        if (urlObj.hostname.includes('amazon') || urlObj.hostname === 'a.co' || urlObj.hostname === 'amzn.to') {
            // Reemplazar dominio (solo para dominios completos de amazon)
            if (urlObj.hostname.includes('amazon') && localDomain !== 'amazon.com') {
                urlObj.hostname = urlObj.hostname.replace('amazon.com', localDomain);
            }

            // Reemplazar/Añadir Tag
            // Para a.co/amzn.to, añadir el tag como query param suele funcionar tras la redirección de Amazon
            if (urlObj.searchParams.has('tag')) {
                urlObj.searchParams.delete('tag');
            }
            urlObj.searchParams.set('tag', localTag);

            finalUrl = urlObj.toString();
        }
    } catch (e) {
        console.error("Error parsing URL:", e);
        // Fallback to original URL if parsing fails
    }

    // 4. Redirigir (307 Temporary Redirect para no cachear mal la geo)
    return NextResponse.redirect(finalUrl, { status: 307 });
}
