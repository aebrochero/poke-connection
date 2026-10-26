# Poke Connection ⚡ (Pokédex Multi-Generacional)

Aplicación web interactiva desarrollada con **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4** y **Motion**. Emula la experiencia física de una consola Pokédex con estética anime, controles hápticos y efectos de sonido retro de 8-bit, abarcando las **3 Primeras Generaciones (Kanto, Johto y Hoenn: 386 especies)** consumiendo [PokeAPI](https://pokeapi.co/) REST v2.

Diseñada con estándares de **arquitectura de software para entrevistas técnicas senior**: rendimiento óptimo, gestión de caché en memoria, cero dependencias pesadas innecesarias y máxima accesibilidad.

---

## 🌟 Características Principales

### 1. 🔄 Chasis Adaptativo y Multi-Generación (Gen 1 - 3)
- **Rotación Dinámica de Chasis:** Botón interactivo que conmuta entre generaciones, transformando en tiempo real la piel, bordes, lente y gradientes de la Pokédex:
  - **Generación I (Kanto - 151 especies):** Rojo Clásico de Pokédex con acentos amarillos y lente azul cielo.
  - **Generación II (Johto - 100 especies):** Oro & Plata metálico con lente ámbar estilo Ho-oh/Lugia.
  - **Generación III (Hoenn - 135 especies):** Verde Esmeralda tecnológico con lente turquesa estilo Rayquaza.
- **Caché en Memoria por Región:** Las generaciones visitadas se almacenan en un `Map<GenerationId, Pokemon[]>` en cliente, permitiendo cambios de generación instantáneos (0ms de latencia) sin peticiones redundantes.

### 2. 📊 Gráfico de Radar Hexagonal y Modo Duelo Comparativo
- **Renderizado Vectorial SVG Nativo:** Cálculo trigonométrico de vértices normalizados sobre los 6 atributos base (*Salud [PS]*, *Ataque*, *Defensa*, *Ataque Especial*, *Defensa Especial* y *Velocidad*).
- **Comparador Dual de Pokémon (Modo Duelo):** Permite seleccionar un Pokémon rival para proyectar dos polígonos superpuestos con trama punteada, diferencial numérico en vivo (`+15` / `-10`) y código de colores de ventaja/desventaja.

### 3. 📦 Exportación de Ficha Técnica Multi-Formato
- **Exportación a JSON:** Descarga directa de la carga útil completa estructurada con estadísticas base, BST, tipos, habilidades y URLs de sprites oficiales.
- **Exportación a CSV:** Generación de hoja de cálculo tabulada con cabeceras y codificación UTF-8 BOM.
- **Exportación a Markdown:** Ficha técnica formateada lista para documentación o perfiles.

### 4. 🕹️ Controles Físicos del Chasis Interactivos
- **D-Pad de 4 Cuadrantes:**
  - ◀ / ▶: Navegación de páginas anterior y siguiente con sonido háptico.
  - ▲ / ▼: Desplazamiento fluido superior e inferior.
- **Botón SELECT:** Alterna el filtro rápido para visualizar únicamente tus **Pokémon Favoritos**.
- **Botón START:** Enfoca inmediatamente la barra de búsqueda o restablece los filtros activos.
- **Lente Sensor Óptico:** Al hacer clic, ejecuta un ciclo de escaneo con animación de pulso y barrido de frecuencias.
- **Rejilla de Altavoz / Control de Audio:** Permite silenciar (Mute) o activar los efectos retro en cualquier momento.

### 5. 🔊 Sonido Retro 8-bit & Gritos Oficiales (Web Audio API)
- **Sintetizador Web Audio API:** Controlador de audio nativo sin librerías externas que genera ondas cuadradas, triangulares y de sierra para clics, confirmaciones y escaneo.
- **Gritos Oficiales de Especie:** Reproducción del audio oficial de cada Pokémon provisto por PokeAPI Cries.

### 6. ❤️ Sistema de Favoritos Persistido
- Marcado rápido de Pokémon favoritos con icono interactivo en cada tarjeta, sincronizado en `localStorage`.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/) 15 (App Router, Turbopack)
- **UI:** [React](https://react.dev/) 19 (Server Components + Client Hooks)
- **Animaciones:** [Motion](https://motion.dev/) (Framer Motion v14)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) 5
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Audio:** Web Audio API nativo (Zero External Dependencies)
- **Gestor de Paquetes:** [pnpm](https://pnpm.io/)
- **API:** [PokeAPI](https://pokeapi.co/) v2

---

## 📁 Estructura del Proyecto

```text
poke-connection/
├── app/
│   ├── layout.tsx              # Metadatos SEO, fuentes e idioma
│   ├── page.tsx                # Portal de bienvenida Hero Pokédex
│   ├── globals.css             # Directivas y tokens Tailwind CSS v4
│   └── pokemon-list/
│       ├── page.tsx            # Server Component inicial
│       ├── loading.tsx         # Skeleton animado temático
│       └── error.tsx           # Boundary para captura de excepciones
├── components/
│   ├── PokemonCard.tsx         # Tarjeta con prefetch on hover y toggle favoritos
│   ├── PokemonList.tsx         # Chasis Pokédex, D-Pad, SELECT/START y paginación
│   ├── PokemonDetailModal.tsx  # Modal de zoom con comparador dual y exportador
│   └── RadarChart.tsx          # Radar SVG hexagonal con modo duelo comparativo
├── lib/
│   ├── pokeapi.ts              # Fetcher multi-generación y cliente caché
│   ├── exportPokemon.ts        # Generadores y descargadores (JSON, CSV, MD)
│   ├── soundEffects.ts         # Sintetizador 8-bit con Web Audio API
│   └── typeTheme.ts            # Diccionario cromático y etiquetas de stats
├── next.config.ts              # Políticas de optimización de imágenes remotas
└── design.md                   # Sistema de diseño, física de animación y layout
```

---

## 🚀 Instalación y Uso

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev

# 3. Compilar para producción
pnpm build

# 4. Iniciar bundle de producción
pnpm start

# 5. Ejecutar linter
pnpm lint
```

Visita `http://localhost:3000` en tu navegador.

---

## 💡 Aspectos Clave para Entrevistas Técnicas

1. **Eficiencia en Red:** Prefetch inteligente en hover y almacenamiento en caché de dos niveles (`Map` en memoria + `next/image`).
2. **Arquitectura Limpia:** Separación estricta entre la capa de consumo de API (`lib/pokeapi.ts`), manipulación de datos (`lib/exportPokemon.ts`), audio (`lib/soundEffects.ts`) y componentes visuales desacoplados.
3. **Optimización de Bundle:** Cero librerías de gráficos pesadas (D3/Chart.js) o de audio (Howler); la visualización poligonal y el audio están resueltos nativamente con SVG y Web Audio API.
4. **Resiliencia:** Degradación elegante si Web Audio API no está disponible o el usuario prefiere navegar en silencio.
