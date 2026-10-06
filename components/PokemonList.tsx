"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type { Pokemon } from "@/lib/pokeapi";
import PokemonCard from "@/components/PokemonCard";
import PokemonDetailModal from "@/components/PokemonDetailModal";

const ITEMS_PER_PAGE = 20;

type PokemonListProps = {
  pokemons: Pokemon[];
};

export default function PokemonList({ pokemons }: PokemonListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Filtrado de Pokémon por nombre o ID
  const filteredPokemons = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return pokemons;
    return pokemons.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        String(p.id).includes(term) ||
        `#${String(p.id).padStart(3, "0")}`.includes(term)
    );
  }, [pokemons, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE));

  // Ajustar página si el filtro reduce el total
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Obtener los 20 Pokémon correspondientes a la página actual
  const paginatedPokemons = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredPokemons.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPokemons, safeCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Desplazamiento suave al marco del Pokédex
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* CHASIS EXTERIOR POKÉDEX */}
      <div className="w-full bg-gradient-to-b from-red-600 via-red-500 to-red-700 rounded-3xl p-4 sm:p-8 shadow-2xl border-4 border-red-800 relative">
        {/* Luces y sensores superiores icónicos del Pokédex */}
        <div className="flex items-center justify-between pb-6 border-b-4 border-red-800/80 mb-6">
          <div className="flex items-center gap-3">
            {/* Lente principal azul con brillo */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-sky-400 border-4 border-white shadow-[0_0_20px_rgba(56,189,248,0.8)] flex items-center justify-center overflow-hidden">
              <div className="absolute top-1 left-2 w-5 h-5 rounded-full bg-white/70 blur-[1px]" />
              <div className="w-8 h-8 rounded-full bg-blue-600/40 animate-pulse" />
            </div>

            {/* Tres luces LED mini: Rojo, Amarillo, Verde */}
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-white shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
              <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-white shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
              <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
          </div>

          {/* Título de la Pokédex Kanto y botón inicio */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h2 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase drop-shadow font-mono">
                POKÉDEX KANTO
              </h2>
              <span className="text-[10px] text-red-200 font-mono">
                GEN 1 • 151 ESPECIES
              </span>
            </div>
            <Link
              href="/"
              className="px-3 py-1 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold border border-red-600 transition-colors"
            >
              Inicio
            </Link>
          </div>
        </div>

        {/* PANTALLA CENTRAL (CONTENIDO) */}
        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 border-4 border-slate-700 shadow-inner text-white">
          {/* Barra de Búsqueda y Estadísticas de Página */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            {/* Input de Búsqueda */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar por nombre o #..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-2.5 border border-slate-700 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 font-mono"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Indicador de resultados */}
            <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Mostrando{" "}
                <strong className="text-yellow-400">
                  {paginatedPokemons.length}
                </strong>{" "}
                de{" "}
                <strong className="text-white">
                  {filteredPokemons.length}
                </strong>{" "}
                Pokémon
              </span>
            </div>
          </div>

          {/* Cuadrícula de Pokémon con animación de transición de página */}
          <AnimatePresence mode="wait">
            <motion.div
              key={safeCurrentPage + search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 min-h-[460px]"
            >
              {paginatedPokemons.length > 0 ? (
                paginatedPokemons.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={setSelectedPokemon}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-slate-300 font-semibold text-base">
                    No se encontró ningún Pokémon con ese criterio.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-3 px-4 py-1.5 bg-yellow-400 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Restablecer búsqueda
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* PAGINACIÓN DIVERTIDA POKÉDEX (20 por página) */}
          {totalPages > 1 && (
            <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Botón Anterior */}
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs font-bold uppercase tracking-wider text-yellow-300 border border-slate-600 transition-colors flex items-center justify-center gap-1 shadow"
              >
                ◀ Ant
              </button>

              {/* Botones numéricos estilo cartuchos de Pokédex */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = page === safeCurrentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 font-black shadow-[0_0_12px_rgba(250,204,21,0.6)] scale-110 border-2 border-white"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Botón Siguiente */}
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs font-bold uppercase tracking-wider text-yellow-300 border border-slate-600 transition-colors flex items-center justify-center gap-1 shadow"
              >
                Sig ▶
              </button>
            </div>
          )}

          {/* Información de Rango de la página */}
          <div className="mt-3 text-center text-[11px] font-mono text-slate-400">
            Página {safeCurrentPage} de {totalPages} • Mostrando Pokémon #
            {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1} a #
            {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredPokemons.length)}
          </div>
        </div>

        {/* CONTROLES INFERIORES DEL CHASIS POKÉDEX */}
        <div className="mt-6 flex items-center justify-between px-2">
          {/* D-Pad estilizado */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute w-14 h-5 bg-slate-900 rounded-sm shadow-md" />
            <div className="absolute w-5 h-14 bg-slate-900 rounded-sm shadow-md" />
            <div className="absolute w-4 h-4 bg-slate-800 rounded-full" />
          </div>

          {/* Botones alargados (Select / Start) */}
          <div className="flex gap-3">
            <div className="w-10 h-3 bg-slate-900 rounded-full rotate-[-20deg] shadow-inner" />
            <div className="w-10 h-3 bg-slate-900 rounded-full rotate-[-20deg] shadow-inner" />
          </div>

          {/* Rejilla de altavoz */}
          <div className="flex flex-col gap-1.5">
            <div className="w-12 h-1 bg-red-900 rounded-full" />
            <div className="w-12 h-1 bg-red-900 rounded-full" />
            <div className="w-12 h-1 bg-red-900 rounded-full" />
          </div>
        </div>
      </div>

      {/* MODAL DETALLE DE POKÉMON (ZOOM ANIMADO) */}
      <PokemonDetailModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
}
