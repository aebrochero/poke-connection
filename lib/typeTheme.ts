// lib/typeTheme.ts

export type PokemonTypeConfig = {
  label: string;
  gradient: string;
  badgeBg: string;
  hex: string;
};

export const TYPE_THEMES: Record<string, PokemonTypeConfig> = {
  normal: {
    label: "Normal",
    gradient: "from-stone-400 to-stone-600",
    badgeBg: "bg-stone-500",
    hex: "#A8A878",
  },
  fire: {
    label: "Fuego",
    gradient: "from-orange-500 via-amber-500 to-red-600",
    badgeBg: "bg-gradient-to-r from-orange-500 to-red-500",
    hex: "#F08030",
  },
  water: {
    label: "Agua",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    badgeBg: "bg-gradient-to-r from-blue-500 to-cyan-500",
    hex: "#6890F0",
  },
  grass: {
    label: "Planta",
    gradient: "from-emerald-400 via-green-500 to-teal-700",
    badgeBg: "bg-gradient-to-r from-emerald-500 to-green-600",
    hex: "#78C850",
  },
  electric: {
    label: "Eléctrico",
    gradient: "from-amber-300 via-yellow-400 to-amber-500",
    badgeBg: "bg-gradient-to-r from-yellow-400 to-amber-500",
    hex: "#F8D030",
  },
  ice: {
    label: "Hielo",
    gradient: "from-cyan-300 via-sky-400 to-blue-400",
    badgeBg: "bg-gradient-to-r from-cyan-400 to-sky-500",
    hex: "#98D8D8",
  },
  fighting: {
    label: "Lucha",
    gradient: "from-red-600 via-rose-700 to-red-900",
    badgeBg: "bg-gradient-to-r from-red-600 to-rose-700",
    hex: "#C03028",
  },
  poison: {
    label: "Veneno",
    gradient: "from-purple-500 via-fuchsia-600 to-purple-800",
    badgeBg: "bg-gradient-to-r from-purple-600 to-fuchsia-600",
    hex: "#A040A0",
  },
  ground: {
    label: "Tierra",
    gradient: "from-amber-600 via-yellow-700 to-amber-800",
    badgeBg: "bg-gradient-to-r from-amber-600 to-yellow-700",
    hex: "#E0C068",
  },
  flying: {
    label: "Volador",
    gradient: "from-indigo-300 via-sky-400 to-blue-500",
    badgeBg: "bg-gradient-to-r from-indigo-400 to-sky-500",
    hex: "#A890F0",
  },
  psychic: {
    label: "Psíquico",
    gradient: "from-pink-500 via-rose-500 to-fuchsia-600",
    badgeBg: "bg-gradient-to-r from-pink-500 to-rose-500",
    hex: "#F85888",
  },
  bug: {
    label: "Bicho",
    gradient: "from-lime-500 via-emerald-600 to-green-700",
    badgeBg: "bg-gradient-to-r from-lime-500 to-green-600",
    hex: "#A8B820",
  },
  rock: {
    label: "Roca",
    gradient: "from-yellow-700 via-amber-800 to-stone-800",
    badgeBg: "bg-gradient-to-r from-yellow-700 to-amber-800",
    hex: "#B8A038",
  },
  ghost: {
    label: "Fantasma",
    gradient: "from-indigo-700 via-purple-800 to-slate-900",
    badgeBg: "bg-gradient-to-r from-indigo-700 to-purple-800",
    hex: "#705898",
  },
  dragon: {
    label: "Dragón",
    gradient: "from-violet-600 via-indigo-700 to-blue-800",
    badgeBg: "bg-gradient-to-r from-violet-600 to-indigo-700",
    hex: "#7038F8",
  },
  steel: {
    label: "Acero",
    gradient: "from-slate-400 via-zinc-500 to-slate-600",
    badgeBg: "bg-gradient-to-r from-slate-400 to-zinc-500",
    hex: "#B8B8D0",
  },
  fairy: {
    label: "Hada",
    gradient: "from-pink-300 via-rose-400 to-fuchsia-400",
    badgeBg: "bg-gradient-to-r from-pink-300 to-rose-400",
    hex: "#EE99AC",
  },
};

export const DEFAULT_THEME: PokemonTypeConfig = {
  label: "Desconocido",
  gradient: "from-blue-600 to-indigo-700",
  badgeBg: "bg-blue-600",
  hex: "#3B82F6",
};

export function getTypeTheme(type?: string): PokemonTypeConfig {
  if (!type) return DEFAULT_THEME;
  return TYPE_THEMES[type.toLowerCase()] || DEFAULT_THEME;
}

export const STAT_LABELS: Record<string, string> = {
  hp: "PS",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "ATK.ESP",
  "special-defense": "DEF.ESP",
  speed: "VEL",
};
