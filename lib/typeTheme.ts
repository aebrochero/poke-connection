// lib/typeTheme.ts

export type PokemonTypeConfig = {
  label: string;
  gradient: string;
  bgLight: string;
  badgeBg: string;
  textCol: string;
  borderColor: string;
  hex: string;
  shadow: string;
};

export const TYPE_THEMES: Record<string, PokemonTypeConfig> = {
  normal: {
    label: "Normal",
    gradient: "from-stone-400 to-stone-600",
    bgLight: "bg-stone-50",
    badgeBg: "bg-stone-500",
    textCol: "text-stone-800",
    borderColor: "border-stone-400",
    hex: "#A8A878",
    shadow: "shadow-stone-500/30",
  },
  fire: {
    label: "Fuego",
    gradient: "from-orange-500 via-amber-500 to-red-600",
    bgLight: "bg-orange-50",
    badgeBg: "bg-gradient-to-r from-orange-500 to-red-500",
    textCol: "text-orange-950",
    borderColor: "border-orange-500",
    hex: "#F08030",
    shadow: "shadow-orange-500/40",
  },
  water: {
    label: "Agua",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    bgLight: "bg-sky-50",
    badgeBg: "bg-gradient-to-r from-blue-500 to-cyan-500",
    textCol: "text-blue-950",
    borderColor: "border-blue-400",
    hex: "#6890F0",
    shadow: "shadow-blue-500/40",
  },
  grass: {
    label: "Planta",
    gradient: "from-emerald-400 via-green-500 to-teal-700",
    bgLight: "bg-emerald-50",
    badgeBg: "bg-gradient-to-r from-emerald-500 to-green-600",
    textCol: "text-emerald-950",
    borderColor: "border-emerald-500",
    hex: "#78C850",
    shadow: "shadow-green-500/40",
  },
  electric: {
    label: "Eléctrico",
    gradient: "from-amber-300 via-yellow-400 to-amber-500",
    bgLight: "bg-yellow-50",
    badgeBg: "bg-gradient-to-r from-yellow-400 to-amber-500",
    textCol: "text-amber-950",
    borderColor: "border-yellow-400",
    hex: "#F8D030",
    shadow: "shadow-yellow-400/50",
  },
  ice: {
    label: "Hielo",
    gradient: "from-cyan-300 via-sky-400 to-blue-400",
    bgLight: "bg-cyan-50",
    badgeBg: "bg-gradient-to-r from-cyan-400 to-sky-500",
    textCol: "text-cyan-950",
    borderColor: "border-cyan-300",
    hex: "#98D8D8",
    shadow: "shadow-cyan-400/40",
  },
  fighting: {
    label: "Lucha",
    gradient: "from-red-600 via-rose-700 to-red-900",
    bgLight: "bg-red-50",
    badgeBg: "bg-gradient-to-r from-red-600 to-rose-700",
    textCol: "text-red-950",
    borderColor: "border-red-600",
    hex: "#C03028",
    shadow: "shadow-red-600/40",
  },
  poison: {
    label: "Veneno",
    gradient: "from-purple-500 via-fuchsia-600 to-purple-800",
    bgLight: "bg-purple-50",
    badgeBg: "bg-gradient-to-r from-purple-600 to-fuchsia-600",
    textCol: "text-purple-950",
    borderColor: "border-purple-500",
    hex: "#A040A0",
    shadow: "shadow-purple-500/40",
  },
  ground: {
    label: "Tierra",
    gradient: "from-amber-600 via-yellow-700 to-amber-800",
    bgLight: "bg-amber-50",
    badgeBg: "bg-gradient-to-r from-amber-600 to-yellow-700",
    textCol: "text-amber-950",
    borderColor: "border-amber-600",
    hex: "#E0C068",
    shadow: "shadow-amber-600/40",
  },
  flying: {
    label: "Volador",
    gradient: "from-indigo-300 via-sky-400 to-blue-500",
    bgLight: "bg-indigo-50",
    badgeBg: "bg-gradient-to-r from-indigo-400 to-sky-500",
    textCol: "text-indigo-950",
    borderColor: "border-indigo-400",
    hex: "#A890F0",
    shadow: "shadow-indigo-400/40",
  },
  psychic: {
    label: "Psíquico",
    gradient: "from-pink-500 via-rose-500 to-fuchsia-600",
    bgLight: "bg-pink-50",
    badgeBg: "bg-gradient-to-r from-pink-500 to-rose-500",
    textCol: "text-pink-950",
    borderColor: "border-pink-400",
    hex: "#F85888",
    shadow: "shadow-pink-500/40",
  },
  bug: {
    label: "Bicho",
    gradient: "from-lime-500 via-emerald-600 to-green-700",
    bgLight: "bg-lime-50",
    badgeBg: "bg-gradient-to-r from-lime-500 to-green-600",
    textCol: "text-lime-950",
    borderColor: "border-lime-500",
    hex: "#A8B820",
    shadow: "shadow-lime-500/40",
  },
  rock: {
    label: "Roca",
    gradient: "from-yellow-700 via-amber-800 to-stone-800",
    bgLight: "bg-stone-50",
    badgeBg: "bg-gradient-to-r from-yellow-700 to-amber-800",
    textCol: "text-stone-950",
    borderColor: "border-yellow-700",
    hex: "#B8A038",
    shadow: "shadow-yellow-700/40",
  },
  ghost: {
    label: "Fantasma",
    gradient: "from-indigo-700 via-purple-800 to-slate-900",
    bgLight: "bg-indigo-50",
    badgeBg: "bg-gradient-to-r from-indigo-700 to-purple-800",
    textCol: "text-indigo-950",
    borderColor: "border-indigo-700",
    hex: "#705898",
    shadow: "shadow-indigo-700/50",
  },
  dragon: {
    label: "Dragón",
    gradient: "from-violet-600 via-indigo-700 to-blue-800",
    bgLight: "bg-violet-50",
    badgeBg: "bg-gradient-to-r from-violet-600 to-indigo-700",
    textCol: "text-violet-950",
    borderColor: "border-violet-600",
    hex: "#7038F8",
    shadow: "shadow-violet-600/50",
  },
  steel: {
    label: "Acero",
    gradient: "from-slate-400 via-zinc-500 to-slate-600",
    bgLight: "bg-slate-50",
    badgeBg: "bg-gradient-to-r from-slate-400 to-zinc-500",
    textCol: "text-slate-950",
    borderColor: "border-slate-400",
    hex: "#B8B8D0",
    shadow: "shadow-slate-400/30",
  },
  fairy: {
    label: "Hada",
    gradient: "from-pink-300 via-rose-400 to-fuchsia-400",
    bgLight: "bg-pink-50",
    badgeBg: "bg-gradient-to-r from-pink-300 to-rose-400",
    textCol: "text-pink-950",
    borderColor: "border-pink-300",
    hex: "#EE99AC",
    shadow: "shadow-pink-300/40",
  },
};

export const DEFAULT_THEME: PokemonTypeConfig = {
  label: "Desconocido",
  gradient: "from-blue-600 to-indigo-700",
  bgLight: "bg-slate-50",
  badgeBg: "bg-blue-600",
  textCol: "text-slate-900",
  borderColor: "border-blue-500",
  hex: "#3B82F6",
  shadow: "shadow-blue-500/30",
};

export function getTypeTheme(type?: string): PokemonTypeConfig {
  if (!type) return DEFAULT_THEME;
  return TYPE_THEMES[type.toLowerCase()] || DEFAULT_THEME;
}

export const STAT_LABELS: Record<string, { label: string; short: string; color: string }> = {
  hp: { label: "Salud (PS)", short: "PS", color: "#FF5959" },
  attack: { label: "Ataque", short: "ATK", color: "#F5AC78" },
  defense: { label: "Defensa", short: "DEF", color: "#FAE078" },
  "special-attack": { label: "Ataque Especial", short: "ATK.ESP", color: "#9DB7F5" },
  "special-defense": { label: "Defensa Especial", short: "DEF.ESP", color: "#A7DB8D" },
  speed: { label: "Velocidad", short: "VEL", color: "#FA92B2" },
};
