# Poke Connection

Aplicación web desarrollada con Next.js y Tailwind CSS para consultar y explorar Pokémon consumiendo la [PokeAPI](https://pokeapi.co/) REST v2 en tiempo real.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/) 15.5.27 (App Router)
- **Librería UI:** [React](https://react.dev/) 19
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) 5
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gestor de paquetes:** [pnpm](https://pnpm.io/) (v11+)
- **Fuente de datos:** [PokeAPI](https://pokeapi.co/) REST v2

---

## 📁 Estructura del Proyecto

```text
poke-connection/
├── app/
│   ├── layout.tsx              # Layout raíz, metadatos SEO y fuentes Geist
│   ├── page.tsx                # Pantalla de inicio con navegación nativa
│   ├── globals.css             # Directivas y tokens Tailwind CSS v4
│   └── pokemon-list/
│       ├── page.tsx            # Catálogo de Pokémon (Server Component)
│       ├── loading.tsx         # Skeleton visual de carga durante el fetch
│       └── error.tsx           # Boundary para captura y reintento de errores
├── components/
│   ├── PokemonCard.tsx         # Tarjeta optimizada con next/image
│   └── PokemonList.tsx         # Grid responsive de tarjetas
├── lib/
│   └── pokeapi.ts              # Fetcher y extractor de IDs desde PokeAPI
├── next.config.ts              # Reglas de optimización y dominios remotos
├── pnpm-workspace.yaml         # Políticas de compilación y overrides seguros
└── tsconfig.json               # Configuración de TypeScript
```

---

## 🚀 Rutas Disponibles

- `/` : Pantalla de bienvenida con enlace directo al catálogo.
- `/pokemon-list` : Catálogo de Pokémon renderizado en el servidor con fallback de carga (`loading.tsx`), manejo de fallos (`error.tsx`) y enlace de retorno.

---

## 💻 Instalación y Ejecución

> [!IMPORTANT]
> Este proyecto utiliza exclusivamente **pnpm** como gestor de paquetes para garantizar resolución determinista y protección contra vulnerabilidades en la cadena de suministro.

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

3. **Abrir en el navegador:**
   [http://localhost:3000](http://localhost:3000)

---

## 📜 Scripts Disponibles

- `pnpm dev`: Inicia el entorno local con Turbopack.
- `pnpm build`: Genera el bundle de producción optimizado.
- `pnpm start`: Ejecuta el servidor en modo producción.
- `pnpm lint`: Analiza el código con ESLint.
- `pnpm audit`: Inspecciona vulnerabilidades de dependencias.
