import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs'; // Must be nodejs for cheerio, not edge

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
        return new NextResponse('Missing query', { status: 400 });
    }

    console.log(`[LiveSearch] Searching for: ${query}`);

    try {
        // 1. Fetch Amazon Search Results
        // We use a generic User-Agent to avoid immediate blocking
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
        };

        const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl, { headers });

        console.log(`[LiveSearch] Amazon Response Status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Amazon blocked request: ${response.status}`);
        }

        const html = await response.text();
        console.log(`[LiveSearch] HTML Length: ${html.length}`);
        const $ = cheerio.load(html);

        const products: any[] = [];

        // 2. Parse Results
        // Selectors change often, we try standard ones
        $('.s-result-item[data-component-type="s-search-result"]').each((i, el) => {
            if (products.length >= 4) return false; // Limit to 4

            try {
                const title = $(el).find('h2 a span').text().trim();
                if (!title) return;

                // Price
                let price = 0;
                const priceWhole = $(el).find('.a-price-whole').first().text().replace(/[,.]/g, '');
                const priceFraction = $(el).find('.a-price-fraction').first().text();
                if (priceWhole) {
                    price = parseFloat(`${priceWhole}.${priceFraction || '00'}`);
                }

                // Image
                const image = $(el).find('img.s-image').attr('src');

                // Link / ASIN
                const link = $(el).find('h2 a').attr('href');
                const asin = $(el).attr('data-asin');

                // Coupon
                let couponText = null;
                const couponEl = $(el).find('.s-coupon-unclipped, .s-coupon-clipped, span.s-coupon-highlight-color').first();
                if (couponEl.length > 0) {
                    couponText = couponEl.text().trim();
                    if (!couponText.toLowerCase().includes('coupon') && !couponText.toLowerCase().includes('cupón')) {
                        couponText = `Cupón: ${couponText}`;
                    }
                }

                // Rating
                let rating = 0;
                const ratingEl = $(el).find('i[class*="a-icon-star"] span.a-icon-alt').first();
                if (ratingEl.length > 0) {
                    const ratingText = ratingEl.text();
                    rating = parseFloat(ratingText.split(' ')[0]);
                } else {
                    // Fallback for aria-label
                    const ariaLabel = $(el).find('span[aria-label*="stars"]').attr('aria-label');
                    if (ariaLabel) {
                        rating = parseFloat(ariaLabel.split(' ')[0]);
                    }
                }

                // Reviews
                let reviewCount = 0;
                const reviewEl = $(el).find('span.a-size-base.s-underline-text').first();
                if (reviewEl.length > 0) {
                    reviewCount = parseInt(reviewEl.text().replace(/[,.]/g, ''));
                }

                if (title && price > 0 && image && asin) {
                    products.push({
                        id: asin, // Temporary ID
                        clean_title: title.substring(0, 80) + (title.length > 80 ? '...' : ''),
                        current_price: price,
                        original_price: price * 1.2, // Mock original for display
                        discount_percentage: 20, // Mock discount
                        image_url: image,
                        product_url: link?.startsWith('http') ? link : `https://www.amazon.com${link}`,
                        rating: rating || 0,
                        review_count: reviewCount || 0,
                        lumina_score: 85,
                        ai_badge: '🔍 Live Result',
                        ai_summary: 'Resultado encontrado en tiempo real.',
                        category: query.charAt(0).toUpperCase() + query.slice(1),
                        sales_phrase: 'Encontrado ahora mismo para ti.',
                        coupon_text: couponText
                    });
                }
            } catch (e) {
                // Skip item on error
            }
        });

        console.log(`[LiveSearch] Found ${products.length} products`);
        return NextResponse.json(products);

    } catch (error) {
        console.error("[LiveSearch] Error:", error);
        return new NextResponse('Search failed', { status: 500 });
    }
}
