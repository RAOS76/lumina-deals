import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmailTemplate } from '@/lib/email-templates';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use Service Role Key for writing to protected table
const resendApiKey = process.env.RESEND_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Check if already subscribed
        const { data: existing } = await supabase
            .from('subscribers')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
        }

        // 2. Insert into DB
        const { error } = await supabase
            .from('subscribers')
            .insert([{ email }]);

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // 3. Send Welcome Email (if Resend is configured)
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Lumina <hola@luminaofertas.com>',
                    to: email,
                    subject: '¡Bienvenido a Lumina Ofertas! ✨',
                    html: WelcomeEmailTemplate(email),
                });
                console.log(`[Email] Welcome email sent to ${email}`);
            } catch (emailError) {
                console.error('[Email] Failed to send welcome email:', emailError);
                // Don't fail the request if email fails, just log it
            }
        }

        return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
