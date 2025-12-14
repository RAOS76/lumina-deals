import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const adminRoute = process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET;

    // 1. Stealth Check: If request is for the secret route
    if (adminRoute && request.nextUrl.pathname.startsWith(`/${adminRoute}`)) {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                    },
                },
            }
        );

        // 2. Auth Check
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // If no user, return 404 (Stealth Mode), UNLESS it's the root login page
        if (!user) {
            // Allow access to the exact secret route (Login Page)
            // Handle optional trailing slash
            const path = request.nextUrl.pathname;
            if (path === `/${adminRoute}` || path === `/${adminRoute}/`) {
                return response;
            }

            console.warn(`[Middleware] Unauthorized access attempt to ${request.nextUrl.pathname}`);
            return NextResponse.rewrite(new URL('/404', request.url));
        }

        // 3. Role Check (Query Profiles)
        // Note: We are temporarily relaxing this to debug navigation issues.
        // The Layout will enforce the role check.

        /*
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        console.log(`[Middleware] User: ${user.email}, Role: ${profile?.role}, Path: ${request.nextUrl.pathname}`);

        if (!profile || profile.role !== 'admin') {
            console.warn(`[Middleware] Non-admin access attempt by ${user.email}`);
            return NextResponse.rewrite(new URL('/404', request.url));
        }
        */

        console.log(`[Middleware] User: ${user.email} authenticated. Delegating role check to Layout.`);

        // Authorized
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
