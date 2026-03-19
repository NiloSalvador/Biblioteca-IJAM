import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Faltan variables de entorno PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const users = [
    {
        email: 'admin@ijamvirtual.edu.pe',
        password: 'Password123!',
        user_metadata: { full_name: 'Administrador Principal', role: 'ADMIN' },
    },
    {
        email: 'docente@ijamvirtual.edu.pe',
        password: 'Password123!',
        user_metadata: { full_name: 'Docente Prueba', role: 'TEACHER' },
    },
    {
        email: 'estudiante@ijamvirtual.edu.pe',
        password: 'Password123!',
        user_metadata: { full_name: 'Estudiante Prueba', role: 'STUDENT' },
    }
];

async function createUsers() {
    console.log('Creando usuarios de prueba en Supabase auth...');
    for (const user of users) {
        const { data: existingUser } = await supabase.auth.admin.getUserById(user.email).catch(() => ({ data: null }));

        const { data, error } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            user_metadata: user.user_metadata,
            email_confirm: true
        });

        if (error) {
            if (error.status === 422) {
                console.log(`El usuario ${user.email} probablemente ya existe. Verificando rol en DB pública...`);
                // Si ya existe, nos aseguramos de que su tabla public.users tenga el rol correcto
                const { data: qUser } = await supabase.from('users').select('id').eq('institutional_email', user.email).single();
                if (qUser) {
                    await supabase.from('users').update({ role: user.user_metadata.role }).eq('id', qUser.id);
                    console.log(`Rol de ${user.email} actualizado a ${user.user_metadata.role} en DB pública.`);
                }
            } else {
                console.error(`Error creando ${user.email}:`, error.message);
            }
        } else {
            console.log(`Usuario Auth creado: ${user.email} (${user.user_metadata.role})`);
            // Update the public.users table role just in case the trigger didn't pick up the exact metadata immediately
            if (data?.user) {
                // wait 1 second for the trigger to fire
                await new Promise(r => setTimeout(r, 1000));
                await supabase.from('users').update({ role: user.user_metadata.role }).eq('id', data.user.id);
            }
        }
    }
    console.log('Proceso completado.');
}

createUsers();
