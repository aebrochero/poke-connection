"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type { Pokemon, GenerationId } from "@/lib/pokeapi";
import { GENERATIONS, getPokemonsByGeneration } from "@/lib/pokeapi";
import PokemonCard from "@/components/PokemonCard";
import PokemonDetailModal from "@/components/PokemonDetailModal";
import { soundEffects } from "@/lib/soundEffects";

const ITEMS_PER_PAGE = 20;

type PokemonListProps = {
  pokemons: Pokemon[];
};

export default function PokemonList({ pokemons: initialPokemons }: PokemonListProps) {
  const [generation, setGeneration] = useState<GenerationId>(1);
  const [pokemons, setPokemons] = useState<Pokemon[]>(initialPokemons);
  const [isChangingGen, setIsChangingGen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Sistema de Favoritos persistido en localStorage
  const [favorites, setFavorites] = useState<number[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Estado de sonido y animación del lente
  const [isMuted, setIsMuted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cargar favoritos y preferencia de audio en cliente
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("pokedex_favorites");
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
      setIsMuted(soundEffects.isMuted());
    } catch {
      // Ignorar errores de localStorage
    }
  }, []);

  const toggleFavorite = (_e: React.MouseEvent, pokemon: Pokemon) => {
    soundEffects.playSelect();
    setFavorites((prev) => {
      const exists = prev.includes(pokemon.id);
      const updated = exists
        ? prev.filter((id) => id !== pokemon.id)
        : [...prev, pokemon.id];
      try {
        localStorage.setItem("pokedex_favorites", JSON.stringify(updated));
      } catch {
        // Ignorar
      }
      return updated;
    });
  };

  const currentGenConfig = GENERATIONS[generation];
  const nextGenId = ((generation % 3) + 1) as GenerationId;
  const nextGenConfig = GENERATIONS[nextGenId];

  // Ciclar a la siguiente generación con cambio de diseño del chasis
  const handleCycleGeneration = async () => {
    soundEffects.playGenSwitch();
    setIsChangingGen(true);
    try {
      const nextPokemons = await getPokemonsByGeneration(nextGenId);
      setGeneration(nextGenId);
      setPokemons(nextPokemons);
      setCurrentPage(1);
      setSearch("");
    } catch (err) {
      console.error("Error al cambiar de generación:", err);
    } finally {
      setIsChangingGen(false);
    }
  };

  // Disparar escáner óptico del lente sensor
  const triggerScanner = () => {
    soundEffects.playScanner();
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 800);
  };

  // Alternar sonido de la Pokédex
  const toggleSound = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  // Filtrado de Pokémon por nombre, ID o Favoritos
  const filteredPokemons = useMemo(() => {
    let result = pokemons;

    if (onlyFavorites) {
      result = result.filter((p) => favorites.includes(p.id));
    }

    const term = search.toLowerCase().trim();
    if (!term) return result;

    return result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        String(p.id).includes(term) ||
        `#${String(p.id).padStart(3, "0")}`.includes(term)
    );
  }, [pokemons, search, onlyFavorites, favorites]);

  const totalPages = Math.max(1, Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Paginación a 20 items
  const paginatedPokemons = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredPokemons.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPokemons, safeCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      soundEffects.playDpad();
      setCurrentPage(newPage);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Botón START: Enfoque rápido en el buscador o reset
  const handleStartButton = () => {
    soundEffects.playStart();
    if (search || onlyFavorites) {
      setSearch("");
      setOnlyFavorites(false);
      setCurrentPage(1);
    } else {
      searchInputRef.current?.focus();
    }
  };

  // Botón SELECT: Alternar vista de Favoritos
  const handleSelectButton = () => {
    soundEffects.playSelect();
    setOnlyFavorites((prev) => !prev);
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* CHASIS EXTERIOR POKÉDEX CON ESTILO DINÁMICO SEGÚN GENERACIÓN */}
      <motion.div
        animate={{
          boxShadow: `0 25px 50px -12px ${currentGenConfig.theme.glowColor}`,
        }}
        transition={{ duration: 0.5 }}
        className={`w-full bg-gradient-to-b ${currentGenConfig.theme.chassisGradient} rounded-3xl p-4 sm:p-8 border-4 ${currentGenConfig.theme.chassisBorder} relative transition-all duration-500`}
      >
        {/* CABECERA: Lente Sensor, LEDs y Selector de Generación */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between pb-6 border-b-4 ${currentGenConfig.theme.headerBorder} mb-6 gap-4`}
        >
          {/* Lado Izquierdo: Lente Sensor Interactivo y LEDs */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            {/* Lente principal interactivo con sonido de escaneo */}
            <button
              type="button"
              onClick={triggerScanner}
              title="Pulsar para activar escáner óptico"
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white flex items-center justify-center overflow-hidden cursor-pointer active:scale-90 transition-transform ${currentGenConfig.theme.lensGradient}`}
            >
              <div className="absolute top-1 left-2 w-5 h-5 rounded-full bg-white/70 blur-[1px]" />
              <div
                className={`w-8 h-8 rounded-full bg-white/30 ${
                  isScanning ? "animate-ping scale-150" : "animate-pulse"
                }`}
              />
            </button>

            {/* Tres luces LED mini */}
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-white shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
              <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-white shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
              <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>

            {/* Botón Silenciador de Audio */}
            <button
              type="button"
              onClick={toggleSound}
              className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-white border border-white/20 text-xs font-mono transition-colors flex items-center gap-1"
              title={isMuted ? "Activar audio 8-bit" : "Silenciar audio"}
            >
              <span>{isMuted ? "🔇" : "🔊"}</span>
              <span className="hidden md:inline">{isMuted ? "Mute" : "Audio"}</span>
            </button>
          </div>

          {/* Lado Derecho: Título de Región y BOTÓN DE CAMBIO DE GENERACIÓN/TEMA */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <h2 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase drop-shadow font-mono">
                {currentGenConfig.title}
              </h2>
              <span className={`text-[10px] font-mono ${currentGenConfig.theme.accentText}`}>
                {currentGenConfig.badge}
              </span>
            </div>

            {/* BOTÓN REQUERIDO: Cambia color/diseño de Pokédex y avanza a siguiente generación */}
            <button
              type="button"
              onClick={handleCycleGeneration}
              disabled={isChangingGen}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-white transition-all shadow-lg active:scale-95 flex items-center gap-1.5 border ${currentGenConfig.theme.accentBg}`}
              title={`Avanzar a ${nextGenConfig.name} (${nextGenConfig.region})`}
            >
              <span>{isChangingGen ? "⏳" : "🔄"}</span>
              <span className="font-extrabold uppercase tracking-wider">
                {isChangingGen ? "Cargando..." : `Ir a ${nextGenConfig.region}`}
              </span>
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors"
            >
              Inicio
            </Link>
          </div>
        </div>

        {/* PANTALLA CENTRAL (CONTENIDO) */}
        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 border-4 border-slate-700 shadow-inner text-white">
          {/* Barra de Búsqueda, Filtro de Favoritos y Estadísticas */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            {/* Input de Búsqueda y Botón de Favoritos */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <input
                  ref={searchInputRef}
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

              {/* Botón Filtro Rápido de Favoritos */}
              <button
                type="button"
                onClick={handleSelectButton}
                className={`px-3 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                  onlyFavorites
                    ? "bg-red-600 text-white border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                    : "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-700"
                }`}
                title="Filtrar sólo tus Pokémon favoritos"
              >
                <span>❤️</span>
                <span className="hidden sm:inline">Favoritos</span>
                <span className="bg-slate-800 px-1.5 py-0.2 rounded-full text-[10px]">
                  {favorites.length}
                </span>
              </button>
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
                Pokémon ({currentGenConfig.region})
              </span>
            </div>
          </div>

          {/* Cuadrícula de Pokémon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={generation + "-" + safeCurrentPage + "-" + search + "-" + onlyFavorites}
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
                    isFavorite={favorites.includes(pokemon.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-slate-300 font-semibold text-base">
                    {onlyFavorites
                      ? "Aún no has guardado ningún Pokémon en tus favoritos."
                      : "No se encontró ningún Pokémon con ese criterio."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setOnlyFavorites(false);
                    }}
                    className="mt-3 px-4 py-1.5 bg-yellow-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer hover:bg-yellow-300"
                  >
                    Restablecer filtros
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* PAGINACIÓN POKÉDEX (20 por página) */}
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

              {/* Botones numéricos estilo cartuchos */}
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

          {/* Información de Rango */}
          <div className="mt-3 text-center text-[11px] font-mono text-slate-400">
            Página {safeCurrentPage} de {totalPages} • Mostrando Pokémon #
            {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1} a #
            {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredPokemons.length)}
          </div>
        </div>

        {/* CONTROLES INFERIORES DEL CHASIS INTERACTIVOS */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
          {/* D-PAD COMPLETAMENTE INTERACTIVO */}
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 flex items-center justify-center select-none">
              {/* Cruz Horizontal */}
              <div className="absolute w-20 h-7 bg-slate-950 rounded-md shadow-lg border border-slate-800 flex justify-between items-center px-1">
                <button
                  type="button"
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-yellow-400 disabled:opacity-30 active:scale-90 font-black text-xs cursor-pointer"
                  title="Página Anterior (D-Pad Izquierda)"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-yellow-400 disabled:opacity-30 active:scale-90 font-black text-xs cursor-pointer"
                  title="Página Siguiente (D-Pad Derecha)"
                >
                  ▶
                </button>
              </div>

              {/* Cruz Vertical */}
              <div className="absolute w-7 h-20 bg-slate-950 rounded-md shadow-lg border border-slate-800 flex flex-col justify-between items-center py-1 pointer-events-none">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playDpad();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-yellow-400 active:scale-90 font-black text-xs cursor-pointer pointer-events-auto"
                  title="Ir al inicio (D-Pad Arriba)"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playDpad();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                  }}
                  className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-yellow-400 active:scale-90 font-black text-xs cursor-pointer pointer-events-auto"
                  title="Ir al final (D-Pad Abajo)"
                >
                  ▼
                </button>
              </div>

              {/* Centro de la cruz */}
              <div
                onClick={() => soundEffects.playDpad()}
                className="absolute w-6 h-6 bg-slate-900 rounded-full border border-slate-700 shadow-inner z-10 cursor-pointer"
              />
            </div>
            <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider hidden sm:inline">
              D-PAD (PÁGINAS / SCROLL)
            </span>
          </div>

          {/* BOTONES FÍSICOS SELECT / START INTERACTIVOS */}
          <div className="flex items-center gap-6">
            {/* SELECT: Alternar Favoritos */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleSelectButton}
                className="w-12 h-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-full rotate-[-25deg] shadow-md active:scale-95 transition-all cursor-pointer"
                title="SELECT: Alternar filtro de Favoritos"
              />
              <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">
                SELECT
              </span>
            </div>

            {/* START: Enfoque / Reset rápido */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleStartButton}
                className="w-12 h-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-full rotate-[-25deg] shadow-md active:scale-95 transition-all cursor-pointer"
                title="START: Buscar / Resetear filtros"
              />
              <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">
                START
              </span>
            </div>
          </div>

          {/* Rejilla de altavoz con sonido */}
          <button
            type="button"
            onClick={toggleSound}
            className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-black/20 transition-colors cursor-pointer"
            title="Rejilla de audio: Alternar Mute / Sonido"
          >
            <div className="w-14 h-1 bg-black/60 rounded-full" />
            <div className="w-14 h-1 bg-black/60 rounded-full" />
            <div className="w-14 h-1 bg-black/60 rounded-full" />
          </button>
        </div>
      </motion.div>

      {/* MODAL DETALLE DE POKÉMON (CON COMPARADOR DUAL Y EXPORTACIÓN) */}
      <PokemonDetailModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        allPokemons={pokemons}
      />
    </div>
  );
}
