import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 3600; // Revalidate every hour

interface Props {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

    if (error) {
        console.error('Error fetching post:', error);
        return null;
    }

    return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: 'Artículo no encontrado' };

    return {
        title: `${post.title} | Blog Lumina`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.cover_image ? [post.cover_image] : [],
            type: 'article',
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">Artículo no encontrado</h1>
                        <Link href="/blog" className="text-indigo-600 hover:underline">
                            Volver al Blog
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <main className="pt-32 pb-20">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al Blog
                    </Link>

                    {/* Header */}
                    <header className="text-center mb-12">
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-6">
                            <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.created_at).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-md">
                                <User className="w-6 h-6 text-slate-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-900">Equipo Lumina</p>
                                <p className="text-xs text-slate-500">Editor</p>
                            </div>
                        </div>
                    </header>

                    {/* Cover Image */}
                    {post.cover_image && (
                        <div className="max-w-2xl mx-auto mb-12">
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src={post.cover_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg prose-slate mx-auto prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-img:rounded-xl prose-img:shadow-lg bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                
                /* Preserve whitespace and indentation */
                .prose p, .prose li, .prose blockquote {
                    white-space: pre-wrap;
                }
                
                /* Better paragraph spacing - with !important to override Tailwind */
                .prose p {
                    margin-bottom: 1.5em !important;
                }
                
                /* Ensure spacing works on mobile */
                @media (max-width: 768px) {
                    .prose p {
                        margin-bottom: 1.5em !important;
                        line-height: 1.75 !important;
                    }
                }
            ` }} />
        </div>
    );
}
