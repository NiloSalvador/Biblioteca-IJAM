const SUPABASE_URL = "https://cixjinejsudylepoyfro.supabase.co";
const ANON_KEY = "sb_publishable_EWxmx7F-lc2wyqpNTBUpyQ_CWil-Sgb";

const users = [
    {
        email: 'admin@ijamvirtual.edu.pe',
        password: 'Password123!',
        data: { full_name: 'Administrador Principal', role: 'ADMIN' },
    },
    {
        email: 'docente@ijamvirtual.edu.pe',
        password: 'Password123!',
        data: { full_name: 'Docente Prueba', role: 'TEACHER' },
    },
    {
        email: 'estudiante@ijamvirtual.edu.pe',
        password: 'Password123!',
        data: { full_name: 'Estudiante Prueba', role: 'STUDENT' },
    }
];

async function seed() {
    for (const user of users) {
        console.log(`Registering ${user.email}...`);
        try {
            const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
                method: 'POST',
                headers: {
                    'apikey': ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await res.json();
            if (!res.ok) {
                console.error(`Error ${user.email}:`, data.msg || data);
            } else {
                console.log(`Success ${user.email}`);
            }
        } catch (e) {
            console.error(`Fetch fail ${user.email}:`, e.message);
        }
    }
}

seed();
