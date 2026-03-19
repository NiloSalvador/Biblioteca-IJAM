# Contexto del Proyecto: Sistema de Biblioteca Virtual IJAM

Este documento sirve como referencia completa para continuar el desarrollo del sistema en futuras sesiones.

## 1. Objetivo del Proyecto
Desarrollar una plataforma web para el instituto "John A. Mackay" que gestione tanto **libros físicos** como **libros virtuales**.
*   **Usuarios:** Estudiantes (lectura/reserva) y Administradores (gestión).
*   **Problemática Principal:** Controlar el acceso temporal (2-3 días) a libros virtuales sin DRM costoso.
*   **Solución Elegida:** Visor Web (Streaming). El PDF no se descarga; se visualiza en la web y el acceso se revoca al vencer el préstamo.

## 2. Stack Tecnológico
*   **Framework**: Astro (Base y Routing) + React (Componentes interactivos).
*   **Estilos**: TailwindCSS.
*   **Base de Datos / BaaS**: Supabase (PostgreSQL, Auth, Storage).
*   **Hosting Previsto**: Vercel o Netlify.

## 3. Arquitectura de Datos (Supabase)

### Tablas Clave
1.  **`users`**: Roles 'ADMIN' o 'STUDENT'. Login inicial manual, futuro Google Auth (`@ijamvirtual.edu.pe`).
2.  **`books`**:
    *   `type`: 'PHYSICAL' | 'VIRTUAL'
    *   `resource_url`: URL privada en Storage (solo virtuales).
    *   `stock_physical` vs `stock_virtual_licenses`.
3.  **`loans`**:
    *   Estados: `ACTIVE`, `RETURNED`, `OVERDUE`.
    *   Lógica: `due_date` se calcula automáticamente (+3 días).

## 4. Flujos Clave

### A. Préstamo Virtual
1.  Estudiante solicita libro.
2.  Si hay stock virtual, se crea `loan`.
3.  Botón cambia a "Leer".
4.  Al leer, el backend verifica `loan` activo -> genera URL firmada temporal -> muestra en visor PDF.

### B. Préstamo Físico
1.  Estudiante reserva.
2.  Admin entrega libro físico y marca préstamo como `ACTIVE`.
3.  Devolución presencial -> Admin marca `RETURNED`.

## 5. Estado Actual
*   **Diseño Técnico Aprobado**: Ver `design.md`.
*   **Siguientes Pasos (Implementación)**:
    1.  Inicializar proyecto Astro + React + Tailwind.
    2.  Configurar proyecto en Supabase (Tablas y Auth).
    3.  Implementar Layout base y Auth.

## 6. Referencias
*   `task.md`: Lista de tareas de la sesión de brainstorming.
*   `design.md`: Especificación técnica detallada.
*   `design_options.md`: Análisis de alternativas para el préstamo virtual.
