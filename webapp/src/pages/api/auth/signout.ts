import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const supabase = supabaseServer(cookies, request);
    await supabase.auth.signOut();

    // Limpieza adicional de cookies propia de Astro por si algo se atasca
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });

    return redirect('/');
};
