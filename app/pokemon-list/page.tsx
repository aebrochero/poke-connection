import Link from "next/link";
import { getPokemons } from "@/lib/pokeapi";
import PokemonList from "@/components/PokemonList";

export default async function PokemonPage() {
  const pokemons = await getPokemons(100);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 py-10 px-6">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Lista de Pokémon</h1>
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-blue-600 underline underline-offset-4 transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
      <PokemonList pokemons={pokemons} />
    </main>
  );
}
