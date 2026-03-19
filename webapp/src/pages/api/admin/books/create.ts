import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const supabase = supabaseServer(cookies, request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return redirect('/login');
    }

    // Verificación de rol ADMIN en Backend
    const { data: profile } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (profile?.role !== 'ADMIN') {
        return redirect('/catalogo');
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const author = formData.get('author')?.toString();
    const category = formData.get('category')?.toString();
    const description = formData.get('description')?.toString();
    const type = formData.get('type')?.toString() as 'PHYSICAL' | 'VIRTUAL';
    const stock = parseInt(formData.get('stock')?.toString() || '1');

    const coverFile = formData.get('cover') as File;
    const pdfFile = formData.get('pdfFile') as File;

    if (!title || !author || !type) {
        return redirect('/admin/agregar-libro?error=Faltan campos obligatorios');
    }

    let coverUrl = null;
    let resourceUrl = null;

    try {
        // 1. Upload Cover Image (if exists and is actual file)
        if (coverFile && coverFile.size > 0) {
            const fileExt = coverFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `covers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('covers')
                .upload(filePath, coverFile);

            if (!uploadError) {
                // Para public buckets podemos sacar la public url, asumimos portadas son publicas:
                const { data: publicUrlData } = supabase.storage.from('covers').getPublicUrl(filePath);
                coverUrl = publicUrlData.publicUrl;
            } else {
                console.error("Cover upload error", uploadError);
            }
        }

        // 2. Upload PDF (if VIRTUAL and exists)
        if (type === 'VIRTUAL' && pdfFile && pdfFile.size > 0) {
            const fileExt = pdfFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`; // bucket is just 'pdfs' 

            const { error: pdfError } = await supabase.storage
                .from('pdfs') // This should be a PRIVATE bucket
                .upload(filePath, pdfFile);

            if (!pdfError) {
                // We only save the path, NOT a public URL. The viewer will generate Signed URL.
                resourceUrl = filePath;
            } else {
                console.error("PDF upload error", pdfError);
            }
        }

        // 3. Insert into Database
        const { error: insertError } = await supabase
            .from('books')
            .insert([
                {
                    title,
                    author,
                    description,
                    category,
                    type,
                    total_stock: stock,
                    available_stock: stock,
                    cover_url: coverUrl,
                    resource_url: resourceUrl
                }
            ]);

        if (insertError) {
            console.error("DB Insert Error", insertError);
            return redirect('/admin/agregar-libro?error=Error al guardar en base de datos');
        }

        return redirect('/admin/dashboard?msg=Libro registrado de forma exitosa');

    } catch (err) {
        console.error(err);
        return redirect('/admin/agregar-libro?error=Ocurrió un error de servidor interno');
    }
};
