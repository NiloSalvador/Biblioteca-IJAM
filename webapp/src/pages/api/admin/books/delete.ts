import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies }) => {
    const supabase = supabaseServer(cookies, request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    const { data: profile } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (profile?.role !== 'ADMIN') {
        return new Response(JSON.stringify({ error: 'Permisos insuficientes' }), { status: 403 });
    }

    try {
        const body = await request.json();
        const { book_id } = body;

        if (!book_id) {
            return new Response(JSON.stringify({ error: 'ID de libro no proporcionado' }), { status: 400 });
        }

        // 1. Validar que no haya préstamos activos o reservados para este libro
        const { data: activeLoans, error: loanError } = await supabase
            .from('loans')
            .select('id')
            .eq('book_id', book_id)
            .in('status', ['ACTIVE', 'RESERVED']);

        if (loanError) throw loanError;

        if (activeLoans && activeLoans.length > 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'No se puede eliminar la obra porque tiene préstamos activos o reservas pendientes.'
            }), { status: 400 });
        }

        // 2. Obtener la data del libro para saber qué archivos eliminar
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('cover_url, resource_url')
            .eq('id', book_id)
            .single();

        if (bookError) throw bookError;

        // 3. Eliminar archivos del Storage si existen
        if (book?.cover_url) {
            // Extraer el path asumiendo formato URL pública ".../public/covers/covers/archivo.jpg" o ".../public/covers/archivo.jpg"
            const urlParts = book.cover_url.split('/public/covers/');
            if (urlParts.length > 1) {
                const filePath = urlParts[1];
                await supabase.storage.from('covers').remove([filePath]);
            }
        }

        if (book?.resource_url) {
            // Documento virtual es solo el path
            await supabase.storage.from('pdfs').remove([book.resource_url]);
        }

        // 4. Eliminar el libro de la Base de Datos
        const { error: deleteError } = await supabase
            .from('books')
            .delete()
            .eq('id', book_id);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (err: any) {
        console.error("Error deleting book:", err);
        return new Response(JSON.stringify({ error: err.message || 'Error interno del servidor' }), { status: 500 });
    }
};
