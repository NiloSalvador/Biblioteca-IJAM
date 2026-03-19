import { createClient } from '@supabase/supabase-js';

// Usaremos variables de entorno de Astro (import.meta.env)
// Deben configurarse en un archivo .env local
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
