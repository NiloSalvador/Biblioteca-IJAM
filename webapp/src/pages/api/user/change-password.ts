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
        const currentPassword = formData.get('currentPassword')?.toString();
        const newPassword = formData.get('newPassword')?.toString();
        const confirmPassword = formData.get('confirmPassword')?.toString();

        if (!currentPassword || !newPassword || !confirmPassword) {
            return redirect('/perfil?error=Todos+los+campos+son+obligatorios');
        }

        if (newPassword !== confirmPassword) {
            return redirect('/perfil?error=Las+contraseñas+nuevas+no+coinciden');
        }

        if (newPassword.length < 6) {
            return redirect('/perfil?error=La+nueva+contraseña+debe+tener+al+menos+6+caracteres');
        }

        // 1. Verify current password by signing in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: session.user.email as string,
            password: currentPassword,
        });

        if (signInError) {
            return redirect('/perfil?error=La+contraseña+actual+es+incorrecta');
        }

        // 2. Update to new password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) throw updateError;

        return redirect('/perfil?msg=Contraseña+actualizada+exitosamente');
    } catch (error: any) {
        console.error('Error changing password:', error.message);
        return redirect(`/perfil?error=${encodeURIComponent('Error al cambiar contraseña: ' + error.message)}`);
    }
};
