// Script to create 3 blog posts
// Run with: node create_blog_posts.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/ssr');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const posts = [
    {
        title: 'Ring Video Doorbell 2024: La Revolución de la Seguridad Inteligente en tu Puerta',
        slug: 'ring-video-doorbell-2024-analisis-completo',
        excerpt: 'Análisis completo del timbre inteligente más vendido. Descubre por qué 10 millones de usuarios confían en Ring para proteger sus hogares con video HD, detección inteligente y audio bidireccional.',
        content: '<p>Contenido completo próximamente. Este análisis incluirá características técnicas, comparativas con la competencia, casos de uso reales y recomendaciones de compra.</p>',
        cover_image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200',
        published: false
    },
    {
        title: 'Echo Dot 5ta Generación: El Asistente Inteligente que Cabe en tu Mesita',
        slug: 'echo-dot-5-analisis-altavoz-inteligente-2024',
        excerpt: 'El Echo Dot 5 con reloj redefine los altavoces inteligentes. Audio mejorado 200%, sensor de temperatura y control total de tu hogar por solo $59. Análisis técnico completo.',
        content: '<p>Contenido completo próximamente. Este análisis incluirá especificaciones técnicas, comparativa con Google Nest Mini y HomePod Mini, y casos de uso para smart home.</p>',
        cover_image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=1200',
        published: false
    },
    {
        title: 'Fire TV Stick 4K Max 2023: Streaming Premium por Menos de $60',
        slug: 'fire-tv-stick-4k-max-2023-analisis',
        excerpt: 'El dispositivo de streaming más potente de Amazon. WiFi 6E, Dolby Vision, procesador 40% más rápido y acceso a 1.5M+ apps. Descubre por qué es el mejor cord-cutting device de 2024.',
        content: '<p>Contenido completo próximamente. Este análisis incluirá benchmarks de rendimiento, comparativa con Roku y Chromecast, y guía completa de configuración.</p>',
        cover_image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200',
        published: false
    }
];

async function createPosts() {
    console.log('🚀 Creating 3 blog posts...\n');

    for (const post of posts) {
        console.log(`📝 Creating: ${post.title}`);

        const { data, error } = await supabase
            .from('posts')
            .insert([post])
            .select();

        if (error) {
            console.error(`❌ Error creating post: ${error.message}`);
        } else {
            console.log(`✅ Created successfully! ID: ${data[0].id}`);
            console.log(`   Slug: ${post.slug}`);
            console.log(`   Status: ${post.published ? 'Published' : 'Draft'}\n`);
        }
    }

    console.log('✨ All posts created!');
    console.log('\n📌 Next steps:');
    console.log('1. Go to http://localhost:3000/lumina-ops-secure-8x92/blog');
    console.log('2. Edit each post to add the full content');
    console.log('3. Publish when ready');
    console.log('\n🔄 To rollback: ./backups/rollback_blog_posts.sh');
}

createPosts().catch(console.error);
