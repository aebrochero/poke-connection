// lib/pokeapi.ts

export type Pokemon = {
  id: number;
  name: string;
  image: string;
  artwork: string;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonAbility = {
  name: string;
  is_hidden: boolean;
};

export type PokemonDetail = {
  id: number;
  name: string;
  types: string[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  image: string;
  artwork: string;
  height: number;
  weight: number;
};

export type GenerationId = 1 | 2 | 3;

export type GenerationTheme = {
  name: string;
  chassisGradient: string;
  chassisBorder: string;
  accentBg: string;
  accentText: string;
  headerBorder: string;
  lensGradient: string;
  badgeBg: string;
  glowColor: string;
};

export type GenerationConfig = {
  id: GenerationId;
  name: string;
  region: string;
  offset: number;
  limit: number;
  badge: string;
  title: string;
  theme: GenerationTheme;
};

export const GENERATIONS: Record<GenerationId, GenerationConfig> = {
  1: {
    id: 1,
    name: "Generación I",
    region: "Kanto",
    offset: 0,
    limit: 151,
    badge: "GEN 1 • 151 ESPECIES",
    title: "POKÉDEX KANTO",
    theme: {
      name: "Rojo Clásico (Kanto)",
      chassisGradient: "from-red-600 via-red-500 to-red-700",
      chassisBorder: "border-red-800",
      accentBg: "bg-red-800 hover:bg-red-900 border-red-600",
      accentText: "text-red-200",
      headerBorder: "border-red-800/80",
      lensGradient: "bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.8)]",
      badgeBg: "bg-red-900/60 text-red-200 border-red-700",
      glowColor: "rgba(239, 68, 68, 0.4)",
    },
  },
  2: {
    id: 2,
    name: "Generación II",
    region: "Johto",
    offset: 151,
    limit: 100,
    badge: "GEN 2 • 100 ESPECIES",
    title: "POKÉDEX JOHTO",
    theme: {
      name: "Oro & Plata (Johto)",
      chassisGradient: "from-amber-600 via-yellow-600 to-slate-800",
      chassisBorder: "border-amber-700",
      accentBg: "bg-amber-800 hover:bg-amber-900 border-amber-600",
      accentText: "text-amber-200",
      headerBorder: "border-amber-700/80",
      lensGradient: "bg-amber-300 shadow-[0_0_20px_rgba(252,211,77,0.9)]",
      badgeBg: "bg-amber-950/60 text-amber-200 border-amber-600",
      glowColor: "rgba(245, 158, 11, 0.4)",
    },
  },
  3: {
    id: 3,
    name: "Generación III",
    region: "Hoenn",
    offset: 251,
    limit: 135,
    badge: "GEN 3 • 135 ESPECIES",
    title: "POKÉDEX HOENN",
    theme: {
      name: "Esmeralda & Rubí (Hoenn)",
      chassisGradient: "from-emerald-600 via-teal-600 to-slate-900",
      chassisBorder: "border-emerald-800",
      accentBg: "bg-emerald-800 hover:bg-emerald-900 border-emerald-600",
      accentText: "text-emerald-200",
      headerBorder: "border-emerald-800/80",
      lensGradient: "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)]",
      badgeBg: "bg-emerald-950/60 text-emerald-200 border-emerald-600",
      glowColor: "rgba(16, 185, 129, 0.4)",
    },
  },
};

export async function getPokemons(
  offset: number = 0,
  limit: number = 151
): Promise<Pokemon[]> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
    {
      next: { revalidate: 86400 }, // Cache 24 horas
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener los pokémon desde PokeAPI");
  }

  const data = await res.json();

  return data.results.map((pokemon: { name: string; url: string }) => {
    const id = Number(pokemon.url.split("/").at(-2));
    return {
      id,
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });
}

// In-memory client cache para generaciones completas
const generationCache = new Map<GenerationId, Pokemon[]>();

export async function getPokemonsByGeneration(
  genId: GenerationId
): Promise<Pokemon[]> {
  if (generationCache.has(genId)) {
    return generationCache.get(genId)!;
  }
  const config = GENERATIONS[genId] || GENERATIONS[1];
  const pokemons = await getPokemons(config.offset, config.limit);
  generationCache.set(genId, pokemons);
  return pokemons;
}

// In-memory client cache para detalles
const clientDetailCache = new Map<number, PokemonDetail>();

export async function getPokemonDetail(id: number): Promise<PokemonDetail> {
  if (clientDetailCache.has(id)) {
    return clientDetailCache.get(id)!;
  }

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`No se pudo obtener el detalle del Pokémon #${id}`);
  }

  const data = await res.json();

  const detail: PokemonDetail = {
    id: data.id,
    name: data.name,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    stats: data.stats.map(
      (s: { base_stat: number; stat: { name: string } }) => ({
        name: s.stat.name,
        value: s.base_stat,
      })
    ),
    abilities: data.abilities.map(
      (a: { ability: { name: string }; is_hidden: boolean }) => ({
        name: a.ability.name,
        is_hidden: a.is_hidden,
      })
    ),
    image:
      data.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
    artwork:
      data.sprites?.other?.["official-artwork"]?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
    height: data.height,
    weight: data.weight,
  };

  clientDetailCache.set(id, detail);

  return detail;
}

export function prefetchPokemonDetail(id: number): void {
  if (clientDetailCache.has(id)) return;
  getPokemonDetail(id).catch(() => {});
}
