"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Pokemon, PokemonDetail } from "@/lib/pokeapi";
import { getPokemonDetail } from "@/lib/pokeapi";
import { getTypeTheme } from "@/lib/typeTheme";
import RadarChart from "@/components/RadarChart";
import { soundEffects } from "@/lib/soundEffects";
import {
  exportPokemonAsJSON,
  exportPokemonAsCSV,
  exportPokemonAsMarkdown,
} from "@/lib/exportPokemon";

type PokemonDetailModalProps = {
  pokemon: Pokemon | null;
  onClose: () => void;
  allPokemons?: Pokemon[];
};

export default function PokemonDetailModal({
  pokemon,
  onClose,
  allPokemons = [],
}: PokemonDetailModalProps) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modo de comparación dual
  const [isComparing, setIsComparing] = useState(false);
  const [rivalSearch, setRivalSearch] = useState("");
  const [rivalPokemon, setRivalPokemon] = useState<Pokemon | null>(null);
  const [rivalDetail, setRivalDetail] = useState<PokemonDetail | null>(null);
  const [rivalLoading, setRivalLoading] = useState(false);

  // Estado para feedback de exportación
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Carga del Pokémon principal
  useEffect(() => {
    if (!pokemon) {
      setDetail(null);
      setError(null);
      setIsComparing(false);
      setRivalPokemon(null);
      setRivalDetail(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    getPokemonDetail(pokemon.id)
      .then((data) => {
        if (isMounted) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Error al cargar la información");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pokemon]);

  // Carga del Pokémon rival para comparativa
  useEffect(() => {
    if (!rivalPokemon) {
      setRivalDetail(null);
      return;
    }

    let isMounted = true;
    setRivalLoading(true);

    getPokemonDetail(rivalPokemon.id)
      .then((data) => {
        if (isMounted) {
          setRivalDetail(data);
          setRivalLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRivalLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [rivalPokemon]);

  // Tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Reproducir grito oficial del Pokémon
  const playPokemonCry = (id: number) => {
    try {
      soundEffects.playSelect();
      const audio = new Audio(
        `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`
      );
      audio.volume = 0.6;
      audio.play().catch(() => {
        soundEffects.playScanner();
      });
    } catch {
      soundEffects.playScanner();
    }
  };

  // Filtrado de lista de rivales disponibles
  const availableRivals = useMemo(() => {
    if (!rivalSearch.trim()) return allPokemons.slice(0, 8);
    const q = rivalSearch.toLowerCase();
    return allPokemons
      .filter((p) => p.name.toLowerCase().includes(q) || String(p.id).includes(q))
      .slice(0, 8);
  }, [allPokemons, rivalSearch]);

  const handleExport = (format: "json" | "csv" | "md") => {
    if (!detail) return;
    soundEffects.playSelect();
    if (format === "json") exportPokemonAsJSON(detail);
    if (format === "csv") exportPokemonAsCSV(detail);
    if (format === "md") exportPokemonAsMarkdown(detail);

    setExportSuccess(`¡Exportado como .${format.toUpperCase()}!`);
    setTimeout(() => setExportSuccess(null), 3000);
  };

  if (!pokemon) return null;

  const primaryType = detail?.types?.[0] || "normal";
  const theme = getTypeTheme(primaryType);

  const rivalPrimaryType = rivalDetail?.types?.[0] || "normal";
  const rivalTheme = getTypeTheme(rivalPrimaryType);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Fondo difuminado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        />

        {/* Contenedor principal del modal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl border-4 border-slate-700/80 shadow-2xl overflow-hidden z-10 text-white my-auto max-h-[92vh] flex flex-col"
        >
          {/* Barra superior de acento con gradiente dinámico */}
          <div className={`h-3 w-full bg-gradient-to-r ${theme.gradient}`} />

          {/* Botón de cierre */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center border-2 border-red-300 shadow-lg hover:rotate-90 transition-transform cursor-pointer"
            title="Cerrar Pokédex"
            aria-label="Cerrar modal"
          >
            ✕
          </button>

          <div className="p-4 sm:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* LADO IZQUIERDO: Tarjeta del Pokémon e Información Base */}
            <div className="md:col-span-5 flex flex-col items-center text-center relative bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
              {/* Halo animado con color elemental */}
              <div
                className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full blur-3xl opacity-35 animate-pulse"
                style={{ backgroundColor: theme.hex }}
              />

              {/* ID de la Pokédex */}
              <span className="text-xs sm:text-sm font-mono font-black text-amber-400 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-400/30 mb-2">
                #{String(pokemon.id).padStart(3, "0")}
              </span>

              {/* Nombre y botón de grito oficial */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl sm:text-3xl font-black capitalize tracking-wide drop-shadow-md text-white">
                  {pokemon.name}
                </h2>
                <button
                  type="button"
                  onClick={() => playPokemonCry(pokemon.id)}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"
                  title="Reproducir grito de la especie"
                  aria-label="Reproducir sonido"
                >
                  🔊
                </button>
              </div>

              {/* Badges de Tipo */}
              <div className="flex gap-2 flex-wrap justify-center mb-3">
                {(detail?.types || ["normal"]).map((type) => {
                  const t = getTypeTheme(type);
                  return (
                    <span
                      key={type}
                      className={`px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md text-white ${t.badgeBg} border border-white/20`}
                    >
                      {t.label}
                    </span>
                  );
                })}
              </div>

              {/* Artwork en Alta Resolución */}
              <div className="relative w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] my-2">
                <Image
                  src={detail?.artwork || pokemon.artwork || pokemon.image}
                  alt={pokemon.name}
                  width={210}
                  height={210}
                  className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>

              {/* Peso y Altura */}
              {detail && (
                <div className="w-full mt-3 flex justify-around text-xs font-mono text-slate-300 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ALTURA</span>
                    <span className="font-bold text-white">
                      {(detail.height / 10).toFixed(1)} m
                    </span>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">PESO</span>
                    <span className="font-bold text-white">
                      {(detail.weight / 10).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">BST</span>
                    <span className="font-bold text-yellow-400">
                      {detail.stats.reduce((acc, curr) => acc + curr.value, 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* BARRA DE EXPORTACIÓN DE ARCHIVOS (REQUISITO ENTREVISTA) */}
              <div className="w-full mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Exportar Ficha Técnica
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleExport("json")}
                    className="px-2 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/50 text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 shadow cursor-pointer active:scale-95"
                    title="Exportar archivo JSON con toda la data"
                  >
                    📦 JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("csv")}
                    className="px-2 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600 text-sky-200 hover:text-white border border-sky-500/50 text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 shadow cursor-pointer active:scale-95"
                    title="Exportar tabla en formato CSV"
                  >
                    📊 CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("md")}
                    className="px-2 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/50 text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 shadow cursor-pointer active:scale-95"
                    title="Exportar ficha técnica Markdown"
                  >
                    📝 MD
                  </button>
                </div>
                {exportSuccess && (
                  <span className="text-[10px] text-emerald-400 font-mono animate-pulse">
                    ✓ {exportSuccess}
                  </span>
                )}
              </div>
            </div>

            {/* LADO DERECHO: Radar de Stats con Comparador Dual + Habilidades */}
            <div className="md:col-span-7 flex flex-col gap-4 bg-slate-950/70 p-4 sm:p-6 rounded-2xl border border-slate-700/60">
              {loading && !detail ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-mono text-yellow-400 animate-pulse">
                    ESCANEANDO DATOS DE POKÉDEX...
                  </p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-900/40 border border-red-500 rounded-xl text-center text-red-300">
                  <p>{error}</p>
                </div>
              ) : detail ? (
                <>
                  {/* Cabecera del Radar y Toggle de Comparativa Dual */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-cyan-400 shadow-sm" />
                        Radar de Estadísticas
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        Total Base: <strong className="text-white">{detail.stats.reduce((a, b) => a + b.value, 0)}</strong>
                      </span>
                    </div>

                    {/* Botón para alternar el comparador dual */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playSelect();
                        setIsComparing(!isComparing);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                        isComparing
                          ? "bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                          : "bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600"
                      }`}
                    >
                      <span>⚡</span>
                      <span>{isComparing ? "Cerrar Duelo" : "Comparar Rival"}</span>
                    </button>
                  </div>

                  {/* Panel del Comparador Dual */}
                  {isComparing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-900/90 border border-amber-500/40 p-3 rounded-xl flex flex-col gap-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                          Selecciona Pokémon Rival para Comparativa
                        </span>
                        {rivalPokemon && (
                          <button
                            type="button"
                            onClick={() => {
                              setRivalPokemon(null);
                              setRivalDetail(null);
                            }}
                            className="text-[10px] text-red-400 hover:text-red-300 font-mono underline"
                          >
                            Quitar rival
                          </button>
                        )}
                      </div>

                      {/* Buscador de rival */}
                      <input
                        type="text"
                        placeholder="Buscar rival por nombre o ID..."
                        value={rivalSearch}
                        onChange={(e) => setRivalSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                      />

                      {/* Lista rápida de sugerencias */}
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {availableRivals.map((rival) => {
                          const isSelected = rivalPokemon?.id === rival.id;
                          return (
                            <button
                              key={rival.id}
                              type="button"
                              onClick={() => {
                                soundEffects.playSelect();
                                setRivalPokemon(rival);
                              }}
                              className={`px-2 py-1 rounded-md text-[11px] font-mono capitalize transition-all flex items-center gap-1 ${
                                isSelected
                                  ? "bg-amber-400 text-slate-950 font-bold border border-white"
                                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                              }`}
                            >
                              <span>#{rival.id}</span>
                              <span>{rival.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Estado del rival seleccionado */}
                      {rivalLoading && (
                        <span className="text-[10px] text-amber-300 font-mono animate-pulse">
                          Cargando datos del rival...
                        </span>
                      )}
                    </motion.div>
                  )}

                  {/* Render del Gráfico de Radar (Soporta modo Dual) */}
                  <div className="flex justify-center">
                    <RadarChart
                      stats={detail.stats}
                      pokemonName={detail.name}
                      themeHex={theme.hex}
                      compareStats={rivalDetail?.stats}
                      compareName={rivalDetail?.name}
                      compareThemeHex={rivalTheme.hex}
                    />
                  </div>

                  {/* Sección de Habilidades Heredables */}
                  <div className="pt-2 border-t border-slate-800">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-amber-400 shadow-sm" />
                      Habilidades (Abilities)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {detail.abilities.map((ability) => (
                        <div
                          key={ability.name}
                          className={`p-2 rounded-xl border flex flex-col justify-between transition-all ${
                            ability.is_hidden
                              ? "bg-gradient-to-br from-amber-950/40 to-purple-950/30 border-amber-500/50"
                              : "bg-slate-900/80 border-slate-700/80"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-bold capitalize text-xs text-white">
                              {ability.name.replace("-", " ")}
                            </span>
                            {ability.is_hidden ? (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                                ⭐ Oculta Heredable
                              </span>
                            ) : (
                              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                Estándar
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {ability.is_hidden
                              ? "Habilidad especial transferible por crianza genética."
                              : "Habilidad base inherente de la especie."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
