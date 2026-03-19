# Propuestas de Diseño: Sistema de Biblioteca Virtual IJAM

Basado en tus requerimientos **(Astro + React + Supabase)** y la necesidad de gestionar préstamos **físicos y virtuales** con control de tiempo (2-3 días), te presento 3 enfoques para la arquitectura del sistema.

## El Reto Principal: "Préstamo" de Libros Virtuales
Controlar que un archivo digital "expire" es difícil si el usuario lo descarga. Para cumplir con tu requisito de "préstamo por tiempo limitado" sin costos altos de DRM (Digital Rights Management), estas son las opciones:

### Opción 1: Modelo "Streaming" / Visor Web ( ⭐ Recomendada)
Los libros **nunca se descargan** al dispositivo del estudiante. Se leen exclusivamente dentro de tu aplicación web mediante un visor integrado (React PDF Viewer o similar).

*   **Experiencia:** El estudiante hace click en "Prestar". Si hay licencias disponibles, el libro se abre en el navegador.
*   **Control de Tiempo:** El sistema verifica la fecha de préstamo cada vez que intentan abrir el visor. Si pasaron los 3 días, el acceso se bloquea automáticamente.
*   **Seguridad:** Dificulta la piratería (no hay botón de descarga directa).
*   **Gestión Física:** Mismo catálogo, pero el botón dice "Reservar para recoger" en lugar de "Leer ahora".

### Opción 2: Modelo de "Descarga con Confianza"
El sistema genera un enlace de descarga temporal (Signed URL de Supabase Storage).

*   **Experiencia:** El estudiante descarga el PDF.
*   **Control de Tiempo:** **No existe control real.** Una vez descargado, el archivo es suyo para siempre. El sistema solo marca el libro como "devuelto" administrativamente después de 3 días, pero el estudiante sigue teniendo el archivo.
*   **Pros:** Más fácil de implementar, funciona sin internet (offline).
*   **Contras:** No cumple estrictamente con "quitar el acceso" tras el préstamo.

### Opción 3: Modelo Híbrido con Clave (Complejo/Enredado)
Descarga de PDF protegido con contraseña que cambia, o uso de formatos propietarios.

*   **No recomendado:** Mala experiencia de usuario y difícil de mantener gratis.

---

## Estructura de Datos (Supabase)
Para soportar ambos mundos (Físico y Virtual), propongo este esquema unificado:

**Tabla `books`**
- `id`
- `title`, `author`, `cover_image`
- `type`: 'PHYSICAL' | 'VIRTUAL'
- `stock_physical`: (int) Cantidad en estantería
- `stock_virtual_licenses`: (int) Cantidad de accesos simultáneos permitidos (o NULL si es ilimitado)
- `file_url`: (string) Ruta en Supabase Storage (solo para virtuales)

**Tabla `loans`**
- `user_id`, `book_id`
- `start_date`, `due_date`
- `status`: 'ACTIVE', 'RETURNED', 'OVERDUE'

---

## Flujo de Usuario Propuesto (Estudiante)
1.  **Login:** Credenciales entregadas por admin (futuro: Google Auth).
2.  **Búsqueda:** Buscador tipo Google con filtros (Físico/Virtual).
3.  **Detalle del Libro:**
    *   Si es **Virtual**: Botón "Leer ahora" (si tiene préstamo activo) o "Solicitar préstamo" (duración 3 días).
    *   Si es **Físico**: Botón "Reservar". Muestra stock disponible y ubicación.
4.  **Mis Libros:** Panel donde ve sus lecturas activas y fechas de devolución.

---

## ¿Cuál es tu decisión?

1.  ¿Te parece bien la **Opción 1 (Visor Web)** para garantizar el control de los días de préstamo en los libros virtuales?
2.  ¿Aprobamos el esquema de base de datos unificado?
