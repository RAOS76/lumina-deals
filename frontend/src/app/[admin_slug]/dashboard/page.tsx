import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    // Fetch Stats
    const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });

    // Example: Products with errors (e.g., no price)
    const { count: errorProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .is('current_price', null);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Bienvenido al centro de control de Lumina.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Productos</p>
                        <p className="text-2xl font-bold text-slate-900">{totalProducts || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Errores Detectados</p>
                        <p className="text-2xl font-bold text-slate-900">{errorProducts || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Estado del Sistema</p>
                        <p className="text-2xl font-bold text-slate-900">Operativo</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Actividad Reciente</h2>
                <div className="text-center py-12 text-slate-400">
                    No hay actividad reciente registrada.
                </div>
            </div>
        </div>
    );
}
