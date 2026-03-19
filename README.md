# Sistema Biblioteca Virtual IJAM

Sistema web de biblioteca para el Instituto "John A. Mackay" (IJAM) en Rioja, San Martín, Perú.

Gestiona libros **físicos** (reserva y retiro en campus) y **virtuales** (lectura streaming mediante visor PDF web). Los PDFs nunca se descargan; se visualizan con URLs firmadas temporales que expiran en 1 hora.

## Stack Tecnológico

- **Framework:** Astro 5.4 (SSR)
- **UI interactiva:** React 19 (islas)
- **Estilos:** TailwindCSS 4
- **Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **Hosting:** Vercel
- **Visor PDF:** react-pdf + pdfjs-dist
- **Iconos:** lucide-react
- **Fuente:** Plus Jakarta Sans

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [pnpm](https://pnpm.io/) (recomendado) o npm
- Una cuenta en [Supabase](https://supabase.com/) con un proyecto configurado

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/sistema-biblioteca-ijam.git
cd sistema-biblioteca-ijam
```

2. Instala las dependencias:

```bash
cd webapp
pnpm install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env
```

Edita `.env` con las credenciales de tu proyecto de Supabase:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

4. Configura la base de datos en Supabase ejecutando el script SQL:

```bash
# Ejecutar el contenido de docs/database.sql en el SQL Editor de Supabase
```

5. Crea los buckets de Storage en Supabase:
   - `covers` — Público (imágenes de portada)
   - `pdfs` — Privado (archivos PDF)

6. Inicia el servidor de desarrollo:

```bash
pnpm dev
```

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build |

## Funcionalidades

- Catálogo público con búsqueda y filtros por tipo y categoría
- Registro con roles (Estudiante, Docente, Personal)
- Préstamos físicos (reserva → activación por admin → devolución)
- Préstamos virtuales (acceso inmediato al visor PDF)
- Visor PDF seguro con URLs firmadas temporales
- Panel de administración (dashboard, libros, usuarios, préstamos)
- Perfil de usuario (editar nombre, cambiar contraseña)

## Estructura del proyecto

```
webapp/
├── src/
│   ├── components/    # Componentes Astro y React
│   ├── layouts/       # Layout base
│   ├── lib/           # Clientes Supabase
│   ├── pages/         # Páginas y API routes
│   └── styles/        # Estilos globales
├── docs/              # SQL y documentación técnica
└── astro.config.mjs
```

## Licencia

Proyecto académico — Taller de Programación Web 2026-I, Instituto IJAM.
