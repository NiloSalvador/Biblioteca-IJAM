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
        envVars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '').replace(/\r$/, '');
    }
});

const supabaseUrl = envVars['PUBLIC_SUPABASE_URL'] || envVars['VITE_SUPABASE_URL'];
const supabaseAnonKey = envVars['PUBLIC_SUPABASE_ANON_KEY'] || envVars['VITE_SUPABASE_ANON_KEY'];

async function testLogin() {
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'admin@ijamvirtual.edu.pe',
            password: 'Password123!'
        })
    });

    const data = await res.json();
    console.log('Login Result:', JSON.stringify(data, null, 2));
}

testLogin();
