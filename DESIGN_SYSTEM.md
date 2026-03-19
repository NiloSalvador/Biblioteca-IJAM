# 🎨 Sistema de Diseño — Biblioteca Virtual IJAM

> **INSTRUCCIÓN PARA EL AGENTE DE IA**: Este archivo es la fuente de verdad para TODOS los estilos visuales del proyecto. Antes de crear o modificar cualquier componente, página o estilo, DEBES leer este documento completo y seguirlo estrictamente. NO inventes colores, fuentes ni estilos propios. Todo debe ser coherente con la identidad corporativa del Instituto John A. Mackay (IJAM).

---

## 1. Identidad Corporativa IJAM

**Referencia visual oficial**: [https://ijamvirtual.edu.pe](https://ijamvirtual.edu.pe)

El Instituto John A. Mackay es una institución educativa técnica superior ubicada en Rioja, San Martín, Perú. Su imagen corporativa transmite **profesionalismo, modernidad y confianza**, con un estilo visual limpio y tecnológico.

### Tono de diseño

- **Profesional y moderno**: interfaz limpia, sin elementos decorativos innecesarios.
- **Tecnológico pero accesible**: debe sentirse como una plataforma educativa seria, no como una app de entretenimiento.
- **Confiable**: colores oscuros dominantes con acentos brillantes generan sensación de solidez.

---

## 2. Paleta de Colores (OBLIGATORIA)

### Colores Primarios (extraídos de ijamvirtual.edu.pe)

| Token CSS / Tailwind   | Nombre            | Hex       | Uso                                         |
|------------------------|-------------------|-----------|----------------------------------------------|
| `--ijam-primary`       | Azul marino IJAM  | `#000949` | Color principal: navbar, fondos hero, footer |
| `--ijam-primary-deep`  | Azul profundo     | `#0a1172` | Gradientes, hover states, fondos alternos   |
| `--ijam-accent`        | Cyan/Turquesa     | `#02f1e4` | Acentos, botones CTA, badges, links hover   |
| `--ijam-accent-soft`   | Cyan suave        | `#06B6D4` | Bordes activos, iconos secundarios           |

### Colores Neutrales

| Token CSS / Tailwind   | Nombre            | Hex       | Uso                                         |
|------------------------|-------------------|-----------|----------------------------------------------|
| `--ijam-white`         | Blanco puro       | `#FFFFFF` | Texto sobre fondos oscuros, fondos de cards |
| `--ijam-surface`       | Gris muy claro    | `#F1F5F9` | Fondo principal de páginas (body)            |
| `--ijam-surface-alt`   | Gris claro        | `#E2E8F0` | Bordes, separadores, fondos alternos         |
| `--ijam-text`          | Gris oscuro       | `#1E293B` | Texto principal sobre fondos claros          |
| `--ijam-text-muted`    | Gris medio        | `#64748B` | Texto secundario, placeholders, subtítulos   |

### Colores de Estado

| Token CSS / Tailwind   | Nombre    | Hex       | Uso                          |
|------------------------|-----------|-----------|-------------------------------|
| `--ijam-success`       | Verde     | `#10B981` | Disponible, activo, éxito    |
| `--ijam-warning`       | Ámbar     | `#F59E0B` | Reservado, advertencia       |
| `--ijam-danger`        | Rojo      | `#EF4444` | Vencido, error, eliminación  |
| `--ijam-info`          | Azul info | `#3B82F6` | Información, enlaces activos |

### ⚠️ Colores PROHIBIDOS

NO uses estos colores bajo ninguna circunstancia:

- ❌ Marrón, beige, café (la IA los genera frecuentemente)
- ❌ Púrpura/violeta como color dominante
- ❌ Rosa/magenta
- ❌ Verdes lima o neón (excepto el cyan corporativo)
- ❌ Grises muy oscuros como fondo principal (solo el azul marino IJAM)

---

## 3. Gradientes Aprobados

Usa SOLO estos gradientes en todo el proyecto:

```css
/* Gradiente principal — Hero, Navbar, Footer */
.gradient-primary {
  background: linear-gradient(135deg, #000949 0%, #0a1172 50%, #000949 100%);
}

/* Gradiente de acento — Botones CTA, badges destacados */
.gradient-accent {
  background: linear-gradient(135deg, #02f1e4 0%, #06B6D4 100%);
}

/* Gradiente overlay — Sobre imágenes de fondo */
.gradient-overlay {
  background: linear-gradient(180deg, rgba(0, 9, 73, 0.9) 0%, rgba(10, 17, 114, 0.7) 100%);
}

/* Gradiente sutil — Cards destacadas */
.gradient-card {
  background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
}
```

---

## 4. Tipografía

### Fuente principal: **Plus Jakarta Sans**

Elegida por su modernidad y excelente legibilidad en interfaces web educativas. NO uses Inter, Roboto ni Arial.

```html
<!-- Importar en Layout.astro -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Escala tipográfica

| Elemento          | Tamaño   | Peso | Uso                                |
|-------------------|----------|------|------------------------------------|
| Hero título       | 3rem     | 800  | Título principal de landing page   |
| H1                | 2.25rem  | 700  | Títulos de página                  |
| H2                | 1.75rem  | 700  | Secciones principales              |
| H3                | 1.25rem  | 600  | Subtítulos, títulos de cards       |
| Body              | 1rem     | 400  | Texto general                      |
| Small / Caption   | 0.875rem | 400  | Texto secundario, metadata         |
| Badge / Tag       | 0.75rem  | 600  | Etiquetas, estados, contadores     |

---

## 5. Configuración Tailwind CSS

### Archivo `global.css` (REEMPLAZAR el actual)

```css
@import "tailwindcss";

@theme {
  /* Colores corporativos IJAM */
  --color-ijam-primary: #000949;
  --color-ijam-primary-deep: #0a1172;
  --color-ijam-accent: #02f1e4;
  --color-ijam-accent-soft: #06B6D4;
  --color-ijam-white: #FFFFFF;
  --color-ijam-surface: #F1F5F9;
  --color-ijam-surface-alt: #E2E8F0;
  --color-ijam-text: #1E293B;
  --color-ijam-text-muted: #64748B;

  /* Estados */
  --color-ijam-success: #10B981;
  --color-ijam-warning: #F59E0B;
  --color-ijam-danger: #EF4444;
  --color-ijam-info: #3B82F6;

  /* Tipografía */
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;

  /* Sombras personalizadas */
  --shadow-card: 0 1px 3px rgba(0, 9, 73, 0.08), 0 4px 12px rgba(0, 9, 73, 0.04);
  --shadow-card-hover: 0 4px 12px rgba(0, 9, 73, 0.12), 0 8px 24px rgba(0, 9, 73, 0.08);
  --shadow-navbar: 0 2px 8px rgba(0, 9, 73, 0.15);

  /* Border radius consistente */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
}

/* Base global */
body {
  font-family: var(--font-sans);
  background-color: var(--color-ijam-surface);
  color: var(--color-ijam-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-ijam-surface);
}
::-webkit-scrollbar-thumb {
  background: var(--color-ijam-primary);
  border-radius: var(--radius-full);
}

/* Focus visible para accesibilidad */
*:focus-visible {
  outline: 2px solid var(--color-ijam-accent);
  outline-offset: 2px;
}
```

---

## 6. Componentes — Especificaciones de Diseño

### 6.1 Navbar

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo IJAM]   Inicio  Catálogo  Mis Préstamos    [Avatar] │
│  Fondo: gradient-primary (#000949 → #0a1172)                │
│  Texto: blanco, peso 500                                    │
│  Link activo: borde inferior cyan #02f1e4, 2px              │
│  Hover: texto cambia a #02f1e4 con transición 200ms         │
│  Altura: 64px (desktop), 56px (mobile)                      │
│  Sombra: shadow-navbar                                      │
│  Posición: sticky top-0 z-50                                │
└─────────────────────────────────────────────────────────────┘
```

- **Logo**: usar imagen oficial de IJAM (`Logo-IJAM-3.png`) a 40px de alto.
- **Mobile**: menú hamburguesa con panel lateral (slide-in desde la derecha), fondo `#000949` con 95% opacidad.

### 6.2 Hero / Landing Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  gradient-overlay sobre fondo oscuro                        │
│                                                             │
│     📚 Biblioteca Virtual IJAM                              │
│     (H1: 3rem, peso 800, color blanco)                     │
│                                                             │
│     Accede a recursos educativos del instituto              │
│     (Body: 1.125rem, peso 400, color blanco/80%)           │
│                                                             │
│     [Explorar Catálogo]  [Iniciar Sesión]                  │
│     (Botón primary)      (Botón outline)                   │
│                                                             │
│     ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                   │
│     │ 500+ │ │ 200+ │ │  50+ │ │ 24/7 │  ← Stats bar     │
│     │Libros│ │Alumnos│ │PDFs  │ │Acceso│                   │
│     └──────┘ └──────┘ └──────┘ └──────┘                   │
│     (Fondo: rgba blanco 10%, border cyan, radius-lg)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Botones

| Variante    | Fondo                        | Texto        | Borde           | Hover                              |
|-------------|------------------------------|--------------|-----------------|-------------------------------------|
| **Primary** | `#02f1e4`                    | `#000949`    | ninguno         | Brillo +10%, sombra cyan suave     |
| **Secondary** | `#000949`                  | `#FFFFFF`    | ninguno         | `#0a1172`, sombra azul suave       |
| **Outline** | transparente                 | `#02f1e4`    | 1.5px `#02f1e4` | Fondo `#02f1e4/10%`                |
| **Ghost**   | transparente                 | `#64748B`    | ninguno         | Fondo `#F1F5F9`                    |
| **Danger**  | `#EF4444`                    | `#FFFFFF`    | ninguno         | Rojo más oscuro                    |

**Propiedades comunes**: `padding: 0.625rem 1.5rem`, `border-radius: var(--radius-md)`, `font-weight: 600`, `transition: all 200ms ease`, `cursor: pointer`.

### 6.4 Cards de Libros

```
┌──────────────────────────┐
│  ┌────────────────────┐  │
│  │                    │  │  ← Imagen portada (aspect-ratio: 3/4)
│  │   [Portada libro]  │  │     object-fit: cover, radius-lg top
│  │                    │  │
│  └────────────────────┘  │
│  ┌─ Badge ─┐              │  ← "Virtual" o "Físico"
│  │ VIRTUAL │              │     Fondo: cyan/15%, texto: cyan
│  └─────────┘              │
│                           │
│  Título del Libro         │  ← H3: peso 600, color ijam-text
│  Autor del libro          │  ← Small: peso 400, color ijam-text-muted
│                           │
│  ⭐ Teología Sistemática  │  ← Categoría: badge gris claro
│                           │
│  ┌─ Disponibilidad ────┐ │
│  │ ✓ 5 disponibles     │ │  ← Verde si > 0, rojo si = 0
│  └──────────────────────┘ │
│                           │
│  [  Ver detalles  →  ]    │  ← Botón outline, full width
│                           │
└──────────────────────────┘

Fondo card: blanco
Sombra: shadow-card → shadow-card-hover en hover
Border: 1px solid #E2E8F0
Border-radius: var(--radius-xl)
Transición: transform 200ms (scale 1.02 en hover)
```

### 6.5 Panel Admin — Dashboard

- **Layout**: sidebar fija (240px) en desktop + área de contenido.
- **Sidebar**: fondo `#000949`, links blancos, ícono activo con acento cyan.
- **Cards de métricas**: fondo blanco, borde izquierdo 4px con color de estado (cyan para total, verde para activos, ámbar para reservados, rojo para vencidos).
- **Tabla de préstamos**: bordes sutiles `#E2E8F0`, header con fondo `#F1F5F9`, filas alternas con fondo sutil, hover row con fondo `#F1F5F9`.

### 6.6 Formularios (Login, Agregar Libro)

- **Container**: card blanca centrada, max-width 480px (login) o 640px (formularios admin).
- **Inputs**: borde `#E2E8F0`, radius-md, padding `0.75rem 1rem`, focus: borde `#02f1e4` con ring cyan suave.
- **Labels**: peso 500, tamaño 0.875rem, color `#1E293B`, margin-bottom 0.5rem.
- **Mensajes de error**: color `#EF4444`, tamaño 0.8rem, ícono ⚠️ inline.

### 6.7 Footer

```
┌─────────────────────────────────────────────────────────────┐
│  Fondo: #000949                                             │
│                                                             │
│  [Logo IJAM]                                                │
│  Instituto de Educación Superior                            │
│  Tecnológico Privado "John A. Mackay"                       │
│  (Texto: blanco/70%)                                        │
│                                                             │
│  Enlaces rápidos        Contacto                            │
│  · Catálogo             Jr. Bernardo Alcedo                 │
│  · Mis Préstamos        Rioja, San Martín                   │
│  · Iniciar Sesión       (+51) 961 577 437                   │
│  (Links: blanco, hover: #02f1e4)                            │
│                                                             │
│  ──────────────────────────────────                         │
│  © 2026 IJAM. Todos los derechos reservados.                │
│  (Texto: blanco/50%, tamaño 0.8rem)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Diseño Responsive

| Breakpoint | Ancho    | Ajustes clave                                     |
|------------|----------|----------------------------------------------------|
| Mobile     | < 640px  | 1 columna, navbar hamburguesa, cards apiladas      |
| Tablet     | 640-1024 | 2 columnas en catálogo, sidebar colapsada en admin |
| Desktop    | > 1024   | 3-4 columnas catálogo, sidebar visible en admin    |

### Reglas responsive obligatorias

- Catálogo: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
- Contenido general: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Hero: texto centrado en mobile, izquierda en desktop.
- Tablas admin: scroll horizontal en mobile con `-webkit-overflow-scrolling: touch`.

---

## 8. Animaciones y Microinteracciones

```css
/* Transición base para todos los elementos interactivos */
.transition-base {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Cards: elevación suave en hover */
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

/* Fade in para carga de páginas */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* Stagger para grillas de cards */
.animate-stagger > *:nth-child(1) { animation-delay: 0.05s; }
.animate-stagger > *:nth-child(2) { animation-delay: 0.10s; }
.animate-stagger > *:nth-child(3) { animation-delay: 0.15s; }
.animate-stagger > *:nth-child(4) { animation-delay: 0.20s; }
.animate-stagger > *:nth-child(5) { animation-delay: 0.25s; }
.animate-stagger > *:nth-child(6) { animation-delay: 0.30s; }

/* Skeleton loading para cards mientras cargan datos */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
```

---

## 9. Íconos

Usar **Lucide React** exclusivamente. Íconos recomendados por contexto:

| Contexto            | Ícono Lucide        |
|---------------------|---------------------|
| Buscar              | `Search`            |
| Libro               | `BookOpen`          |
| Libro cerrado       | `Book`              |
| PDF / Virtual       | `FileText`          |
| Físico              | `Library`           |
| Préstamo activo     | `Clock`             |
| Devuelto            | `CheckCircle`       |
| Vencido             | `AlertTriangle`     |
| Reservado           | `Bookmark`          |
| Usuario             | `User`              |
| Admin               | `Shield`            |
| Dashboard           | `LayoutDashboard`   |
| Agregar             | `Plus`              |
| Cerrar sesión       | `LogOut`            |
| Menú mobile         | `Menu` / `X`        |
| Flecha              | `ChevronRight`      |
| Filtro              | `Filter`            |
| Disponible          | `CheckCircle2`      |

---

## 10. Checklist de Consistencia Visual

Antes de dar por terminada cualquier página o componente, verificar:

- [ ] ¿Los colores usados están en la paleta definida en la Sección 2?
- [ ] ¿NO se usan colores prohibidos (marrón, púrpura, rosa)?
- [ ] ¿La fuente es Plus Jakarta Sans en todos los textos?
- [ ] ¿Los botones siguen las variantes de la Sección 6.3?
- [ ] ¿Las cards tienen sombras y bordes según la Sección 6.4?
- [ ] ¿La navbar usa el gradiente corporativo (#000949 → #0a1172)?
- [ ] ¿El diseño es responsive según los breakpoints de la Sección 7?
- [ ] ¿Los estados (éxito, error, advertencia) usan los colores correctos?
- [ ] ¿Los gradientes usados están en la lista aprobada (Sección 3)?
- [ ] ¿Las animaciones son sutiles y no distraen?

---

## 11. Prompts de Referencia para el Agente

Si necesitas pedirle al agente que corrija o mejore el diseño, usa estos prompts:

### Corrección general de colores
```
Lee el archivo DESIGN_SYSTEM.md y corrige TODOS los componentes y páginas del proyecto 
para que usen exclusivamente la paleta de colores definida. El color primario es #000949 
(azul marino IJAM), el acento es #02f1e4 (cyan/turquesa). Elimina cualquier color que no 
esté en el sistema de diseño. Comienza por el global.css y luego actualiza cada componente.
```

### Mejorar una página específica
```
Lee DESIGN_SYSTEM.md. Mejora el diseño de la página [NOMBRE_PAGINA] siguiendo las 
especificaciones exactas del sistema de diseño. Asegúrate de que use los gradientes 
aprobados, la tipografía Plus Jakarta Sans, y los componentes según las specs (botones, 
cards, formularios). Añade las animaciones fadeInUp con stagger para la carga de elementos.
```

### Rediseñar el frontend completo
```
Lee DESIGN_SYSTEM.md completo. El diseño actual del proyecto NO sigue la identidad 
corporativa de IJAM. Necesito que rediseñes TODAS las páginas y componentes siguiendo 
estrictamente este sistema de diseño. Trabaja en este orden:
1. Actualiza global.css con las variables de la Sección 5
2. Rediseña el Navbar según la Sección 6.1
3. Rediseña el Hero/Landing según la Sección 6.2
4. Actualiza las cards del catálogo según la Sección 6.4
5. Mejora los formularios según la Sección 6.6
6. Actualiza el footer según la Sección 6.7
7. Aplica las animaciones de la Sección 8
NO uses colores fuera de la paleta. NO cambies la fuente a Inter o Roboto.
```
