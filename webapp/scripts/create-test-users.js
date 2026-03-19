import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
});

const supabaseUrl = envVars['PUBLIC_SUPABASE_URL'] || envVars['VITE_SUPABASE_URL'];
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
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
        const { data, error } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            user_metadata: user.user_metadata,
            email_confirm: true
        });

        if (error) {
            if (error.status === 422) {
                console.log(`El usuario ${user.email} probablemente ya existe.`);
                const { data: qUser } = await supabase.from('users').select('id').eq('institutional_email', user.email).single();
                if (qUser) {
                    await supabase.from('users').update({ role: user.user_metadata.role }).eq('id', qUser.id);
                    console.log(`Rol de ${user.email} actualizado a ${user.user_metadata.role} en DB pública.`);
                }
            } else {
                console.error(`Error creando ${user.email}:`, error);
            }
        } else {
            console.log(`Usuario Auth creado: ${user.email} (${user.user_metadata.role})`);
            if (data && data.user) {
                // wait 1.5 seconds for trigger to insert into public.users
                await new Promise(r => setTimeout(r, 1500));
                await supabase.from('users').update({ role: user.user_metadata.role }).eq('id', data.user.id);
            }
        }
    }
    console.log('Proceso completado.');
}

createUsers();
