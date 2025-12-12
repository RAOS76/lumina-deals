import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://luminaofertas.com'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch all products
    const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .not('slug', 'is', null);

    const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
        url: `${BASE_URL}/deal/${product.slug}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...productEntries,
    ];
}
