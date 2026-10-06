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

export async function getPokemons(limit: number = 151): Promise<Pokemon[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`, {
    next: { revalidate: 86400 }, // Cache 24 horas
  });

  if (!res.ok) {
    throw new Error("Error al obtener los pokémon desde PokeAPI");
  }

  const data = await res.json();

  return data.results.map((pokemon: { name: string; url: string }) => {
    const rawId = pokemon.url.split("/").filter(Boolean).pop();
    const id = Number(rawId);
    return {
      id,
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });
}

// In-memory client cache para evitar peticiones repetidas
const clientDetailCache = new Map<number | string, PokemonDetail>();

export async function getPokemonDetail(
  idOrName: number | string
): Promise<PokemonDetail> {
  const cacheKey = typeof idOrName === "string" ? idOrName.toLowerCase() : idOrName;
  if (clientDetailCache.has(cacheKey)) {
    return clientDetailCache.get(cacheKey)!;
  }

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!res.ok) {
    throw new Error(`No se pudo obtener el detalle del Pokémon #${idOrName}`);
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

  clientDetailCache.set(cacheKey, detail);
  clientDetailCache.set(data.id, detail);
  clientDetailCache.set(data.name.toLowerCase(), detail);

  return detail;
}

export function prefetchPokemonDetail(idOrName: number | string): void {
  const cacheKey = typeof idOrName === "string" ? idOrName.toLowerCase() : idOrName;
  if (clientDetailCache.has(cacheKey)) return;
  // Fire and forget
  getPokemonDetail(idOrName).catch(() => {});
}