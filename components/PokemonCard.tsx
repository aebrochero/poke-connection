"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Pokemon } from "@/lib/pokeapi";
import { prefetchPokemonDetail } from "@/lib/pokeapi";

type PokemonCardProps = {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
};

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const handleMouseEnter = () => {
    prefetchPokemonDetail(pokemon.id);
  };

  return (
    <motion.button
      type="button"
      onClick={() => onClick(pokemon)}
      onMouseEnter={handleMouseEnter}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className="group relative flex flex-col items-center bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700/80 hover:border-yellow-400/80 rounded-2xl p-4 shadow-lg hover:shadow-yellow-400/20 transition-colors text-left cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      {/* Fondo con brillo sutil en hover */}
      <div className="absolute inset-0 bg-radial from-yellow-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* ID de Pokédex */}
      <div className="w-full flex justify-between items-center mb-1 z-10">
        <span className="font-mono text-[11px] font-bold text-slate-400 group-hover:text-yellow-400 transition-colors">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
        <div className="w-2 h-2 rounded-full bg-emerald-400/80 group-hover:animate-ping" />
      </div>

      {/* Contenedor de la Imagen */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 my-2 flex items-center justify-center z-10">
        <Image
          src={pokemon.artwork || pokemon.image}
          alt={pokemon.name}
          width={112}
          height={112}
          className="w-full h-full object-contain filter drop-shadow-md group-hover:drop-shadow-[0_8px_16px_rgba(250,204,21,0.35)] transition-all duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Nombre del Pokémon */}
      <h3 className="capitalize font-bold text-slate-100 group-hover:text-yellow-300 text-sm tracking-wide text-center z-10 transition-colors line-clamp-1">
        {pokemon.name}
      </h3>

      {/* Píldora de acción */}
      <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-slate-900 group-hover:bg-yellow-400 px-2 py-0.5 rounded-full transition-all">
        Ver Datos ➜
      </span>
    </motion.button>
  );
}
