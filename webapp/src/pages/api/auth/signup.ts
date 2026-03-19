import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const fullName = formData.get('full_name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const role = formData.get('role')?.toString();

    if (!email || !password || !fullName || !role) {
        return redirect('/registro?error=Todos los campos son obligatorios');
    }

    const supabase = supabaseServer(cookies, request);

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: role,
            }
        }
    });

    if (error) {
        return redirect(`/registro?error=${encodeURIComponent(error.message)}`);
    }

    return redirect('/login?msg=Cuenta creada exitosamente. Inicia sesión.');
};
