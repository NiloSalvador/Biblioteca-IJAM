import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const supabase = supabaseServer(cookies, request);

    // Verify session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return redirect('/login');
    }

    try {
        const formData = await request.formData();
        const full_name = formData.get('full_name')?.toString();

        if (!full_name || full_name.trim().length === 0) {
            return redirect('/perfil?error=El+nombre+no+puede+estar+vacío');
        }

        // Update the profile in public.users
        const { error: updateError } = await supabase
            .from('users')
            .update({ full_name: full_name.trim() })
            .eq('id', session.user.id);

        if (updateError) throw updateError;

        // Optional: update the user metadata in auth.users as well
        await supabase.auth.updateUser({
            data: { full_name: full_name.trim() }
        });

        return redirect('/perfil?msg=Perfil+actualizado+exitosamente');
    } catch (error: any) {
        console.error('Error updating profile:', error.message);
        return redirect(`/perfil?error=${encodeURIComponent('Error al actualizar: ' + error.message)}`);
    }
};
