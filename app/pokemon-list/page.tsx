import { getPokemons } from "@/lib/pokeapi";
import PokemonList from "@/components/PokemonList";

export default async function PokemonPage() {
  // Obtenemos los 151 Pokémon de la 1era generación (Kanto)
  const pokemons = await getPokemons(151);

  return (
    <main className="min-h-screen bg-slate-950 py-8 px-3 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Luces y auras de fondo estilo anime */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <PokemonList pokemons={pokemons} />
    </main>
  );
}
