import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use Service Role Key for writing to protected table

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('subscribers')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
        }

        const { error } = await supabase
            .from('subscribers')
            .insert([{ email }]);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
