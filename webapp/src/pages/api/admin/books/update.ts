import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const supabase = supabaseServer(cookies, request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return redirect('/login');
    }

    const { data: profile } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (profile?.role !== 'ADMIN') {
        return redirect('/catalogo');
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString();
    const author = formData.get('author')?.toString();
    const category = formData.get('category')?.toString();
    const description = formData.get('description')?.toString();
    const type = formData.get('type')?.toString() as 'PHYSICAL' | 'VIRTUAL';
    const stock = parseInt(formData.get('stock')?.toString() || '0');

    const coverFile = formData.get('cover') as File | null;
    const pdfFile = formData.get('pdfFile') as File | null;

    if (!id || !title || !author || !type) {
        return redirect(`/admin/editar-libro/${id}?error=Faltan campos obligatorios`);
    }

    try {
        // Obtenemos los datos actuales del libro
        const { data: book } = await supabase.from('books').select('cover_url, resource_url').eq('id', id).single();

        let coverUrl = book?.cover_url;
        let resourceUrl = book?.resource_url;

        // 1. Upload Cover Image (if selected)
        if (coverFile && coverFile.size > 0) {
            const fileExt = coverFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `covers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('covers')
                .upload(filePath, coverFile);

            if (!uploadError) {
                const { data: publicUrlData } = supabase.storage.from('covers').getPublicUrl(filePath);
                coverUrl = publicUrlData.publicUrl;
            }
        }

        // 2. Upload PDF (if VIRTUAL and selected)
        if (type === 'VIRTUAL' && pdfFile && pdfFile.size > 0) {
            const fileExt = pdfFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;

            const { error: pdfError } = await supabase.storage
                .from('pdfs')
                .upload(fileName, pdfFile);

            if (!pdfError) {
                resourceUrl = fileName;
            }
        } else if (type === 'PHYSICAL') {
            resourceUrl = null; // Si cambia a físico, se desvincula el recurso virtual
        }

        // 3. Update Database
        const { error: updateError } = await supabase
            .from('books')
            .update({
                title,
                author,
                description,
                category,
                type,
                available_stock: stock,
                cover_url: coverUrl,
                resource_url: resourceUrl
            })
            .eq('id', id);

        if (updateError) {
            console.error("DB Update Error", updateError);
            return redirect(`/admin/editar-libro/${id}?error=Error al actualizar la información`);
        }

        return redirect('/admin/libros?msg=Libro actualizado exitosamente');

    } catch (err) {
        console.error(err);
        return redirect(`/admin/editar-libro/${id}?error=Ocurrió un error inesperado al guardar los cambios`);
    }
};
