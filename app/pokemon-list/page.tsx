// app/pokemon-list/page.tsx
import { getPokemons } from "@/lib/pokeapi";
import PokemonList from "@/components/PokemonList";

export default async function PokemonPage() {
  const pokemons = await getPokemons(100);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Lista de Pokémon</h1>
      <PokemonList pokemons={pokemons} />
    </main>
  );
}
