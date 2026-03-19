# CLAUDE.md — Sistema Biblioteca Virtual IJAM

> **Última actualización**: 2026-03-11

## Proyecto

Sistema web de biblioteca para el Instituto "John A. Mackay" (IJAM) en Rioja, San Martín, Perú. Gestiona libros **físicos** (reserva/retiro en campus) y **virtuales** (lectura streaming via visor PDF web). Los PDFs nunca se descargan; se visualizan con URLs firmadas temporales que expiran en 1 hora.

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Astro (SSR, output: server) | 5.4.x |
| UI interactiva | React (islas) | 19.x |
| Estilos | TailwindCSS (via @tailwindcss/vite) | 4.x |
| BaaS | Supabase (PostgreSQL + Auth + Storage + RLS) | — |
| Hosting | Vercel (@astrojs/vercel adapter) | — |
| Iconos | lucide-react (OBLIGATORIO, no usar otros) | 0.575.x |
| PDF | react-pdf + pdfjs-dist | 10.4.x / 5.4.x |
| Fuente | Plus Jakarta Sans (Google Fonts) | — |
| Package Manager | pnpm | — |

## Comandos

```bash
cd webapp
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción (astro check + astro build)
pnpm preview      # Preview del build
```

## Estructura del Proyecto

```
webapp/
├── src/
│   ├── components/
│   │   ├── Navbar.astro          # Navbar sticky con gradient-primary, menú hamburguesa mobile
│   │   ├── Footer.astro          # Footer corporativo (logo, enlaces, contacto, copyright)
│   │   ├── BookCatalog.tsx       # React: catálogo con búsqueda, filtros tipo/categoría, grilla cards
│   │   └── PDFViewer.tsx         # React: visor PDF con zoom, paginación, barra de herramientas
│   ├── layouts/
│   │   └── Layout.astro          # Layout base: head + font Plus Jakarta Sans + Navbar + Footer
│   ├── lib/
│   │   ├── supabase.ts           # Cliente Supabase (browser)
│   │   └── supabaseServer.ts     # Cliente Supabase SSR (parsea cookies del header request)
│   ├── pages/
│   │   ├── index.astro           # Landing: hero con gradiente, stats, CTAs
│   │   ├── login.astro           # Login email/password → POST /api/auth/signin
│   │   ├── registro.astro        # Registro con selector de rol (STUDENT/TEACHER/STAFF)
│   │   ├── catalogo.astro        # Catálogo público → BookCatalog.tsx
│   │   ├── perfil.astro          # Perfil usuario: datos, stats, editar nombre, cambiar contraseña
│   │   ├── mis-prestamos.astro   # Préstamos activos + historial devueltos
│   │   ├── libro/[id].astro      # Detalle libro + botón prestar/reservar
│   │   ├── visor/[id].astro      # Visor PDF seguro (valida loan activo + signed URL)
│   │   ├── admin/
│   │   │   ├── dashboard.astro       # Métricas (obras, activos, reservados, vencidos) + tabla recientes
│   │   │   ├── libros.astro          # Inventario libros: tabla + buscar + filtros + editar/eliminar
│   │   │   ├── usuarios.astro        # Directorio usuarios: tabla + buscar + filtro por rol + contadores
│   │   │   ├── prestamos.astro       # Gestión préstamos: filtros avanzados + activar/devolver + paginación
│   │   │   ├── agregar-libro.astro   # Form nuevo libro con upload portada + PDF
│   │   │   └── editar-libro/[id].astro # Form editar libro existente
│   │   └── api/
│   │       ├── auth/signin.ts        # POST: login → redirect /catalogo
│   │       ├── auth/signup.ts        # POST: registro → redirect /login
│   │       ├── auth/signout.ts       # POST: cerrar sesión → redirect /
│   │       ├── loans/request.ts      # POST: crear préstamo, decrementa stock, previene duplicados
│   │       ├── admin/loans/activate.ts   # POST: RESERVED→ACTIVE + due_date +3 días
│   │       ├── admin/loans/return.ts     # POST: ACTIVE/OVERDUE→RETURNED + incrementa stock
│   │       ├── admin/books/create.ts     # POST: insertar libro + upload archivos a Storage
│   │       ├── admin/books/update.ts     # POST: actualizar libro + archivos opcionales
│   │       ├── admin/books/delete.ts     # POST: eliminar libro (valida sin préstamos activos)
│   │       ├── user/update-profile.ts    # POST: actualizar full_name
│   │       └── user/change-password.ts   # POST: cambiar contraseña (verifica actual)
│   └── styles/
│       └── global.css            # @theme Tailwind con tokens IJAM, animaciones, scrollbar
├── DESIGN_SYSTEM.md              # FUENTE DE VERDAD para todos los estilos visuales
├── astro.config.mjs              # SSR + React + Vercel adapter + tailwindcss vite plugin
├── tsconfig.json
├── .env.example                  # Template de variables de entorno
└── package.json
```

## Base de Datos (Supabase PostgreSQL)

### ENUMs
- `user_role`: ADMIN, STUDENT, TEACHER, STAFF
- `book_type`: PHYSICAL, VIRTUAL
- `loan_status`: RESERVED, ACTIVE, RETURNED, OVERDUE

### Tablas
| Tabla | Columnas clave | RLS |
|-------|---------------|-----|
| `users` | id (UUID PK → auth.users), full_name, institutional_email (UNIQUE), role, created_at | Solo ver perfil propio |
| `books` | id, title, author, description, category, type, cover_url, resource_url, total_stock, available_stock, created_at | Público (lectura) |
| `loans` | id, user_id (FK), book_id (FK), status, loan_date, due_date, return_date, created_at | Solo ver préstamos propios |

### Storage Buckets
- **`covers`** — Público: imágenes de portada
- **`pdfs`** — Privado: archivos PDF (acceso via signed URLs de 1 hora)

### Trigger automático
`handle_new_user()` — al registrarse en auth.users crea perfil en public.users. Lee full_name y role del metadata.

### Schema SQL
Archivo completo en `docs/database.sql` — **NOTA:** puede no incluir TEACHER/STAFF en el enum si no se ha actualizado.

## Autenticación y Autorización

### Patrón SSR (IMPORTANTE)
```typescript
// En páginas Astro:
const supabase = supabaseServer(Astro.cookies, Astro.request);
const { data: { session } } = await supabase.auth.getSession();

// En API routes:
const supabase = supabaseServer(cookies, request);
```
- SIEMPRE pasar cookies + request al crear cliente SSR
- Las cookies se parsean del header `Cookie` del request (NO usar `cookies.all()`)

### Roles y acceso
| Rol | Acceso |
|-----|--------|
| GUEST (no autenticado) | Landing, catálogo, login, registro |
| STUDENT | + Mis préstamos, perfil, solicitar préstamos, visor PDF |
| TEACHER | Mismo que STUDENT (sin diferenciación funcional aún) |
| STAFF | Mismo que STUDENT (sin diferenciación funcional aún) |
| ADMIN | Todo + panel admin (dashboard, libros, usuarios, préstamos) |

### Guard de admin en endpoints
```typescript
const { data: profile } = await supabase.from('users').select('role').eq('id', session.user.id).single();
if (profile?.role !== 'ADMIN') return Astro.redirect('/');
```

## Sistema de Diseño (OBLIGATORIO)

**Leer `DESIGN_SYSTEM.md` antes de modificar cualquier componente visual.**

### Paleta de Colores
| Token Tailwind | Hex | Uso |
|-------|-----|-----|
| `ijam-primary` | `#000949` | Navbar, footer, fondos hero |
| `ijam-primary-deep` | `#0a1172` | Gradientes, hover |
| `ijam-accent` | `#02f1e4` | Botones CTA, badges, links hover |
| `ijam-accent-soft` | `#06B6D4` | Bordes activos, iconos secundarios |
| `ijam-surface` | `#F1F5F9` | Fondo body |
| `ijam-surface-alt` | `#E2E8F0` | Bordes, separadores |
| `ijam-text` | `#1E293B` | Texto principal |
| `ijam-text-muted` | `#64748B` | Texto secundario |
| `ijam-success` | `#10B981` | Disponible, activo, éxito |
| `ijam-warning` | `#F59E0B` | Reservado, advertencia |
| `ijam-danger` | `#EF4444` | Vencido, error |
| `ijam-info` | `#3B82F6` | Información |

### Colores PROHIBIDOS
No usar: marrón, beige, púrpura, rosa, verde lima, grises muy oscuros como fondo.

### Tipografía
**Plus Jakarta Sans** exclusivamente — NO usar Inter, Roboto ni Arial.

### Gradientes aprobados
- `gradient-primary`: 135deg #000949 → #0a1172 → #000949 (navbar, hero, footer)
- `gradient-accent`: 135deg #02f1e4 → #06B6D4 (botones CTA)
- `gradient-overlay`: 180deg rgba(0,9,73,0.9) → rgba(10,17,114,0.7) (sobre imágenes)
- `gradient-card`: 180deg #FFF → #F1F5F9 (cards destacadas)

## Flujos de Negocio

### Préstamo Virtual
1. Estudiante solicita → status ACTIVE, due_date = hoy + 3 días, stock -1
2. Accede al visor PDF con signed URL (1h)
3. Al vencer o devolver → status RETURNED/OVERDUE, stock +1

### Préstamo Físico
1. Estudiante solicita → status RESERVED, stock -1
2. Admin activa (POST /api/admin/loans/activate) → status ACTIVE, due_date = hoy + 3 días
3. Admin marca devuelto → status RETURNED, stock +1

### Registro de usuarios
1. Formulario con selector de rol (STUDENT/TEACHER/STAFF) — NO se puede seleccionar ADMIN
2. POST a /api/auth/signup → Supabase auth.signUp con metadata {full_name, role}
3. Trigger DB crea perfil en public.users leyendo metadata

## Convenciones de Código

- Páginas en español: `mis-prestamos.astro`, `agregar-libro.astro`
- API routes en inglés: `signin.ts`, `request.ts`, `return.ts`
- Variables/código en inglés (camelCase)
- Mensajes de UI en español
- Usar `className` (NO `class`) en componentes React/Lucide
- Joins de Supabase pueden devolver arrays: normalizar con `Array.isArray(x) ? x[0] : x`
- Verificar rol ADMIN en backend (no solo frontend) antes de operaciones admin
- Lucide React para TODOS los iconos (no SVGs custom)

## Estado actual de las funcionalidades

### Implementado y funcional
- [x] Landing page con hero y stats
- [x] Login / Registro (con selector de rol)
- [x] Catálogo público con búsqueda y filtros (tipo, categoría)
- [x] Detalle de libro con solicitud de préstamo
- [x] Mis Préstamos (activos + historial)
- [x] Visor PDF seguro con signed URLs
- [x] Perfil de usuario (ver datos, editar nombre, cambiar contraseña)
- [x] Admin: Dashboard con métricas
- [x] Admin: Lista de libros (tabla + filtros + editar + eliminar)
- [x] Admin: Agregar libro con upload de portada y PDF
- [x] Admin: Editar libro existente
- [x] Admin: Eliminar libro (con validación de préstamos activos)
- [x] Admin: Lista de usuarios (tabla + filtros por rol + contadores)
- [x] Admin: Gestión de préstamos (filtros, activar reservas, devolver, paginación 20/pág)
- [x] Navbar responsive con menú mobile
- [x] Footer corporativo
- [x] Decremento/incremento automático de stock en préstamos

### Pendiente — Seguridad (ALTA PRIORIDAD)
- [ ] **signup.ts no valida rol server-side** — usuario podría manipular form y registrarse como ADMIN
  - FIX: validar que role sea solo STUDENT, TEACHER o STAFF en el endpoint
- [ ] **Race condition en loans/request.ts** — stock check y creación no son atómicos
  - FIX: usar transacción SQL o RPC de Supabase
- [ ] **Sin validación server-side de uploads** — sin límite de tamaño ni verificación MIME
  - FIX: validar tipo y tamaño antes de subir a Storage
- [ ] **Math.random() para nombres de archivo** — colisiones posibles
  - FIX: usar crypto.randomUUID()

### Pendiente — Funcionalidades
- [ ] **Reseteo de contraseña** — link en login apunta a `#`, sin implementar
- [ ] **Préstamos vencidos automáticamente** — no hay cron/trigger que marque OVERDUE
  - Opción A: pg_cron en Supabase (ideal)
  - Opción B: verificar en cada carga de página
- [ ] **Stats del landing hardcodeados** — "500+ libros" etc. son valores fijos, no consultan DB
- [ ] **Toast notifications** — @radix-ui/react-toast instalado pero sin integrar
- [ ] **Reporte mensual** — botón en dashboard existe pero deshabilitado
- [ ] **Roles TEACHER/STAFF** — existen en el formulario de registro pero no hay funcionalidades diferenciadas (por ahora actúan igual que STUDENT)
- [ ] **Renovación de préstamos** — no existe opción de extender due_date

### Pendiente — Diseño
- [ ] **admin/agregar-libro.astro** — usa colores genéricos slate/blue, NO sigue DESIGN_SYSTEM.md

### Pendiente — Calidad
- [ ] Sin error boundaries en componentes React
- [ ] Sin loading skeletons/spinners para fetches async
- [ ] Faltan aria-labels en inputs de búsqueda y botones icon-only
- [ ] PDF fallback demo en visor/[id].astro (usa PDF público si no hay resource_url)

## Variables de Entorno

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

Configurar en Vercel como Environment Variables para producción. No commitear `.env`.

## Notas para el agente

- **SIEMPRE** leer `DESIGN_SYSTEM.md` antes de modificar cualquier componente visual
- El sistema usa Astro SSR — las páginas se renderizan en el servidor, los componentes React se hidratan en el cliente
- Para queries con joins en Supabase, el resultado de relaciones puede venir como array u objeto — siempre normalizar
- El visor PDF requiere préstamo ACTIVE del usuario autenticado — sin loan activo, redirige a /catalogo
- Los archivos PDF están en bucket privado — solo accesibles via signed URL temporal
- Al eliminar libros, también eliminar archivos de Storage (cover + pdf)
- La base de datos puede necesitar actualización del enum user_role para incluir TEACHER y STAFF si no se ha hecho ya (verificar con: `SELECT enum_range(NULL::user_role)`)
