import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User, Shield, Key } from 'lucide-react';

export default async function SettingsPage() {
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

    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
                <p className="text-slate-500">Administra tu perfil y las preferencias del sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Perfil de Usuario</h2>
                            <p className="text-sm text-slate-500">Tu información personal</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                            <p className="font-mono text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">{user?.email}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rol</label>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm">
                                <Shield className="w-3 h-3" />
                                {profile?.role?.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ID de Usuario</label>
                            <p className="font-mono text-xs text-slate-400 break-all">{user?.id}</p>
                        </div>
                    </div>
                </div>

                {/* Security Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                            <Key className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Seguridad</h2>
                            <p className="text-sm text-slate-500">Contraseñas y acceso</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 opacity-60 cursor-not-allowed flex items-center justify-between group">
                            <span className="font-medium">Cambiar Contraseña</span>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Próximamente</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-between group">
                            <span className="font-medium">Habilitar 2FA</span>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Próximamente</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
