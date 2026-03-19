import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const supabase = supabaseServer(cookies, request);

    // 1. Verify session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    // 2. Verify ADMIN role
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (profile?.role !== 'ADMIN') {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
    }

    try {
        const formData = await request.formData();
        const loan_id = formData.get('loan_id')?.toString();

        if (!loan_id) {
            return new Response(JSON.stringify({ error: 'ID de préstamo requerido' }), { status: 400 });
        }

        // 3. Update loan status to ACTIVE and set due_date
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);

        const { error: updateError } = await supabase
            .from('loans')
            .update({
                status: 'ACTIVE',
                due_date: dueDate.toISOString()
            })
            .eq('id', loan_id)
            .eq('status', 'RESERVED'); // Only activate if currently RESERVED

        if (updateError) {
            console.error('Error activating loan:', updateError);
            return new Response(JSON.stringify({ error: 'Error al activar préstamo' }), { status: 500 });
        }

        // Redirect back to admin prestamos
        return redirect('/admin/prestamos?success=Préstamo activado correctamente');

    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(JSON.stringify({ error: 'Error procesando la solicitud' }), { status: 500 });
    }
};
