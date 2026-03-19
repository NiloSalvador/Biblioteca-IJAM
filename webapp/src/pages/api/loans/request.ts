import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const bookId = formData.get('book_id')?.toString();
    const type = formData.get('type')?.toString();

    const supabase = supabaseServer(cookies, request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !bookId) {
        return redirect('/login?error=Debes iniciar sesión primero');
    }

    // Verificar stock disponible antes de crear el préstamo
    const { data: book, error: bookError } = await supabase
        .from('books')
        .select('available_stock')
        .eq('id', bookId)
        .single();

    if (bookError || !book) {
        return redirect(`/libro/${bookId}?error=Libro no encontrado`);
    }

    if (book.available_stock <= 0) {
        return redirect(`/libro/${bookId}?error=No hay ejemplares disponibles`);
    }

    // Verificar si ya tiene el préstamo activo
    const { data: existingLoan } = await supabase
        .from('loans')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('book_id', bookId)
        .eq('status', 'ACTIVE')
        .single();

    if (existingLoan) {
        return redirect(`/mis-prestamos?msg=Ya tienes este libro asignado`);
    }

    // Create new Loan
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const { data, error } = await supabase
        .from('loans')
        .insert([
            {
                user_id: session.user.id,
                book_id: bookId,
                status: type === 'VIRTUAL' ? 'ACTIVE' : 'RESERVED',
                due_date: dueDate.toISOString()
            }
        ])
        .select()
        .single();

    if (error) {
        return new Response(JSON.stringify({ loan_error: error, session_user: session.user.id, book_id: bookId, type }), { status: 500 });
    }

    // Decrementar stock disponible
    await supabase
        .from('books')
        .update({ available_stock: book.available_stock - 1 })
        .eq('id', bookId);

    if (type === 'VIRTUAL') {
        return redirect(`/visor/${data.id}`);
    } else {
        return redirect(`/mis-prestamos?msg=Reserva física exitosa. Tienes 24 horas para acercarte a biblioteca.`);
    }
};
