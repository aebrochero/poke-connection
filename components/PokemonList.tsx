// components/PokemonList.tsx

import PokemonCard from "@/components/PokemonCard";

type Pokemon = {
  name: string;
  image: string;
};

type PokemonListProps = {
  pokemons: Pokemon[];
};

export default function PokemonList({ pokemons }: PokemonListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.name} name={pokemon.name} image={pokemon.image} />
      ))}
    </div>
  );
}
