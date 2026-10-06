export type Pokemon = {
  name: string;
  image: string;
};

export async function getPokemons(limit: number = 10): Promise<Pokemon[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Error al obtener los pokémon");
  }

  const data = await res.json();

  return data.results.map((pokemon: { name: string; url: string }) => {
    const id = pokemon.url.split("/").filter(Boolean).pop();
    return {
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    };
  });
}