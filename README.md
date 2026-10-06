# Poke Connection ⚡ (Pokédex Kanto Gen 1)

Aplicación web interactiva desarrollada con **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4** y **Motion**. Emula la experiencia de una Pokédex clásica con estética anime y colores vibrantes, abarcando los **151 Pokémon de la 1era Generación (Kanto)** consumiendo la [PokeAPI](https://pokeapi.co/) REST v2.

---

## 🌟 Características Principales

- **Chasis Pokédex Clásico:** Borde temático de Pokédex roja con lente azul luminoso, LEDs tricolor (rojo/amarillo/verde), D-pad y rejilla de audio.
- **151 Pokémon de Kanto:** Carga completa de la primera generación con artwork oficial de alta resolución.
- **Paginación Divertida (20 por página):** 8 páginas con controles estilo cartucho retro, navegación táctil y contador dinámico.
- **Modal de Zoom Interactivo (Motion):**
  - **Lado Izquierdo:** Artwork en alta definición, halo elemental animado, badges de tipos e información de peso/altura.
  - **Lado Derecho:** 
    - **Gráfico de Radar / Telaraña Poligonal (SVG):** Representación geométrica de los 6 stats base (*Salud [PS]*, *Ataque*, *Defensa*, *Ataque Especial*, *Defensa Especial* y *Velocidad*).
    - **Habilidades Heredables:** Desglose de habilidades distinguiendo claramente habilidades estándar y **habilidades ocultas heredables (⭐)**.
- **Paleta Dinámica por Tipo Elemental:** Más de 18 paletas de color anime adaptativas según el tipo del Pokémon (Fuego, Agua, Planta, Eléctrico, etc.).
- **Optimización y Rendimiento (React Best Practices):**
  - Cache en memoria en cliente para detalles de Pokémon.
  - Prefetch inteligente al pasar el cursor (`onMouseEnter`).
  - Animaciones de resorte fluidas a 60 FPS con `motion`.
  - Optimización automática de imágenes con `next/image`.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/) 15.5.27 (Turbopack, App Router)
- **UI:** [React](https://react.dev/) 19
- **Animaciones:** [Motion](https://motion.dev/) (Framer Motion v14)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) 5
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gestor de Paquetes:** [pnpm](https://pnpm.io/) (v11+)
- **API:** [PokeAPI](https://pokeapi.co/) v2

---

## 📁 Estructura del Proyecto

```text
poke-connection/
├── app/
│   ├── layout.tsx              # Metadatos SEO, fuentes Geist e idioma es
│   ├── page.tsx                # Home / Portal de bienvenida anime
│   ├── globals.css             # Directivas y tokens Tailwind CSS v4
│   └── pokemon-list/
│       ├── page.tsx            # Server Component con 151 Pokémon Gen 1
│       ├── loading.tsx         # Skeleton temático Pokédex
│       └── error.tsx           # Boundary para captura y reintento
├── components/
│   ├── PokemonCard.tsx         # Tarjeta con prefetch en hover y motion
│   ├── PokemonList.tsx         # Chasis Pokédex, paginación a 20 y filtro
│   ├── PokemonDetailModal.tsx  # Modal de zoom con vista dividida (artwork + stats/abilities)
│   └── RadarChart.tsx          # Gráfico de radar poligonal hexagonal en SVG
├── lib/
│   ├── pokeapi.ts              # Fetcher Gen-1, client cache y prefetch
│   └── typeTheme.ts            # Diccionario cromático y temático por tipo elemental
├── next.config.ts              # Reglas de optimización de imágenes remotas
├── pnpm-workspace.yaml         # Políticas seguras de construcción
└── design.md                   # Documentación integral del sistema de diseño
```

---

## 🚀 Instalación y Uso

> [!NOTE]
> Este proyecto utiliza exclusivamente **pnpm**.

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev

# 3. Compilar para producción
pnpm build

# 4. Ejecutar bundle de producción
pnpm start

# 5. Ejecutar linter
pnpm lint
```

Visita `http://localhost:3000` en tu navegador.

---

## 🎨 Documentación de Diseño

Consulta [design.md](file:///var/www/html/poke-connection/design.md) para el desglose detallado de la paleta cromática elemental, geometría del radar de estadísticas, física de animación y jerarquía visual.
