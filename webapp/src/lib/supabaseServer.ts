import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export const supabaseServer = (cookies: AstroCookies, request: Request) => {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    const cookieHeader = request.headers.get('cookie') ?? '';
                    return cookieHeader.split(';')
                        .map(c => {
                            const [name, ...rest] = c.trim().split('=');
                            return { name: name?.trim() ?? '', value: decodeURIComponent(rest.join('=')?.trim() ?? '') };
                        })
                        .filter(c => c.name);
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            if (value === '') {
                                cookies.delete(name, { path: options?.path || '/' });
                            } else {
                                cookies.set(name, value, { path: options?.path || '/', ...options });
                            }
                        });
                    } catch {
                        // Response already sent (e.g. from Navbar inside Layout).
                        // Safe to ignore — cookies will be refreshed on the next request.
                    }
                }
            }
        }
    );
};
