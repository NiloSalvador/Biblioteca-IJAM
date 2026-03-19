# Diseño Técnico: Biblioteca Virtual IJAM

## 1. Visión General
Sistema web híbrido para la gestión de biblioteca del instituto "John A. Mackay". Permite a estudiantes leer libros virtuales (streaming seguro) y reservar libros físicos. Administradores gestionan inventario y usuarios.

## 2. Stack Tecnológico
*   **Frontend**: Astro (Rendimiento principal), React (Componentes interactivos: Buscador, Dashboard, Visor PDF), TailwindCSS (Estilos).
*   **Backend/BaaS**: Supabase (PostgreSQL, Auth, Storage, Edge Functions si es necesario).
*   **Infraestructura**: Vercel o Netlify (Recomendado para Astro).

## 3. Arquitectura de Datos (Supabase)

### Tablas Principales

**`users`** (Extiende `auth.users` de Supabase)
*   `id` (UUID, PK)
*   `full_name` (text)
*   `role` (enum: 'ADMIN', 'STUDENT')
*   `institutional_email` (text, unique)

**`books`**
*   `id` (UUID, PK)
*   `title` (text)
*   `author` (text)
*   `description` (text)
*   `cover_url` (text)
*   `category` (text)
*   `type` (enum: 'PHYSICAL', 'VIRTUAL')
*   `total_stock` (int) - Para físicos: copias reales. Para virtuales: licencias concurrentes (o null si ilimitado).
*   `available_stock` (int) - Calculado o actualizado por triggers.
*   `resource_url` (text) - Ruta privada en Supabase Storage (solo Virtuales).

**`loans`** (Préstamos)
*   `id` (UUID, PK)
*   `user_id` (FK -> users.id)
*   `book_id` (FK -> books.id)
*   `loan_date` (timestamptz) - Fecha inicio.
*   `due_date` (timestamptz) - Fecha vencimiento (Calculado: +3 días).
*   `return_date` (timestamptz, nullable) - Fecha devolución real.
*   `status` (enum: 'ACTIVE', 'RETURNED', 'OVERDUE')

## 4. Módulos y Flujos

### A. Autenticación
*   **Fase 1**: Admin crea usuarios en panel de Supabase o mediante script. Credenciales entregadas manualmente.
*   **Fase 2**: Integración "Login con Google" restringido al dominio `@ijamvirtual.edu.pe`.

### B. Catálogo y Búsqueda (Público/Privado)
*   Barra de búsqueda reactiva (título, autor, categoría).
*   Filtros: "Disponible ahora", "Tipo: Virtual/Físico".

### C. Préstamo de Libros Virtuales (Core)
1.  Usuario ve detalle y da clic en "Prestar" (si `available_stock > 0`).
2.  Se crea registro en `loans` con `due_date = now() + 3 days`.
3.  El botón cambia a "Leer Ahora".
4.  **Lectura**: Al hacer clic, se abre vista `/read/[book_id]`.
    *   Esta vista verifica si existe un préstamo `ACTIVE` y no vencido.
    *   Si es válido, obtiene una URL firmada (Signed URL) de corta duración para el PDF.
    *   El componente **React PDF Viewer** renderiza el archivo.
    *   *Seguridad*: Se deshabilita menú contextual (anticopia básica) y no se expone link directo de descarga fácil.

### D. Préstamo de Libros Físicos
1.  Usuario ve detalle y da clic en "Reservar".
2.  Se crea registro en `loans` (o tabla aparte `reservations` si se requiere aprobación previa, pero simplificaremos a `loans` con estado 'RESERVED' si se desea, o directo 'ACTIVE' si asumen compromiso de ir).
    *   *Ajuste*: Usaremos estado `RESERVED` (24h para recoger) -> `ACTIVE` (Recogido) -> `RETURNED`.
3.  Control de stock físico estricto.

### E. Panel Administrativo
*   **Gestión de Libros**: CRUD de libros. Subida de PDFs a bucket privado.
*   **Gestión de Préstamos**: Ver quién tiene qué. Marcar devoluciones de físicos.
*   **Usuarios**: Lista de estudiantes.

## 5. UI/UX
*   Diseño limpio, académico pero moderno.
*   Dashboard de estudiante: "Mis Lecturas" (Accesos directos a lo que vence pronto).

## 6. Siguientes Pasos
1.  Configurar proyecto Astro + Tailwind.
2.  Configurar Supabase (Tablas y Policies RLS).
3.  Implementar Auth y Layout base.
