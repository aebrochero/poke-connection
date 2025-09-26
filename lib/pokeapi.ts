// lib/pokeapi.ts

export async function getPokemons(limit: number = 10) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  
  if (!res.ok) throw new Error("Error al obtener los pokémon");

  const data = await res.json();

  // Mapear los resultados para quedarnos con nombre + imagen
  return data.results.map((pokemon: { name: string; url: string }, index: number) => {
    const id = index + 1; // ID según posición
    return {
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    };
  });
}