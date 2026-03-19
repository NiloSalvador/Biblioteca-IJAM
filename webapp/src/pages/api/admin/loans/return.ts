import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies }) => {
    const supabase = supabaseServer(cookies, request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return new Response(JSON.stringify({ error: 'No autenticado' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Verificación de rol ADMIN
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (profile?.role !== 'ADMIN') {
        return new Response(JSON.stringify({ error: 'No autorizado. Se requiere rol de administrador.' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Leer body JSON
    let body: { loan_id?: string };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Body JSON inválido' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { loan_id } = body;

    if (!loan_id) {
        return new Response(JSON.stringify({ error: 'loan_id es requerido' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Verificar que el préstamo existe y está ACTIVE u OVERDUE
    const { data: loan, error: loanError } = await supabase
        .from('loans')
        .select('id, status, book_id')
        .eq('id', loan_id)
        .single();

    if (loanError || !loan) {
        return new Response(JSON.stringify({ error: 'Préstamo no encontrado' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (loan.status === 'RETURNED') {
        return new Response(JSON.stringify({ error: 'Este préstamo ya fue devuelto' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (loan.status !== 'ACTIVE' && loan.status !== 'OVERDUE') {
        return new Response(JSON.stringify({ error: `No se puede devolver un préstamo con estado "${loan.status}"` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 1. Marcar préstamo como RETURNED
    const { error: updateLoanError } = await supabase
        .from('loans')
        .update({
            status: 'RETURNED',
            return_date: new Date().toISOString()
        })
        .eq('id', loan_id);

    if (updateLoanError) {
        return new Response(JSON.stringify({ error: 'Error al actualizar el préstamo' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 2. Incrementar stock del libro
    const { data: book } = await supabase
        .from('books')
        .select('available_stock')
        .eq('id', loan.book_id)
        .single();

    if (book) {
        await supabase
            .from('books')
            .update({ available_stock: book.available_stock + 1 })
            .eq('id', loan.book_id);
    }

    return new Response(JSON.stringify({ success: true, message: 'Préstamo devuelto exitosamente' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
