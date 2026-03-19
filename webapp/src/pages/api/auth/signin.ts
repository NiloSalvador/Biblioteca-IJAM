import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Faltan credenciales' }), { status: 400 });
    }

    const supabase = supabaseServer(cookies, request);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Redirigimos de vuelta con error
        return redirect('/login?error=Credenciales incorrectas');
    }

    // Si login es exitoso, verificar el rol en la DB y crear cookie extra opcional (o leer on-the-fly)
    // Redirigir al inicio o panel
    return redirect('/catalogo');
};
