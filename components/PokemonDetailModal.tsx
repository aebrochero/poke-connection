"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Pokemon, PokemonDetail } from "@/lib/pokeapi";
import { getPokemonDetail } from "@/lib/pokeapi";
import { getTypeTheme } from "@/lib/typeTheme";
import RadarChart from "@/components/RadarChart";

type PokemonDetailModalProps = {
  pokemon: Pokemon | null;
  onClose: () => void;
};

export default function PokemonDetailModal({
  pokemon,
  onClose,
}: PokemonDetailModalProps) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemon) {
      setDetail(null);
      setError(null);
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

  // Tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!pokemon) return null;

  const primaryType = detail?.types?.[0] || "normal";
  const theme = getTypeTheme(primaryType);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Fondo difuminado estilo anime */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Contenedor principal con animación de ZOOM */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            damping: 24,
            stiffness: 280,
          }}
          className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl border-4 border-slate-700/80 shadow-2xl overflow-hidden z-10 text-white"
        >
          {/* Barra superior de acento con el color elemental */}
          <div
            className={`h-3 w-full bg-gradient-to-r ${theme.gradient}`}
          />

          {/* Botón de cierre Pokédex */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center border-2 border-red-300 shadow-lg hover:rotate-90 transition-transform cursor-pointer"
            title="Cerrar Pokédex"
            aria-label="Cerrar modal"
          >
            ✕
          </button>

          <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* LADO IZQUIERDO: Imagen destacada del Pokémon con halo elemental */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center relative">
              {/* Aura / Halo animado detrás del Pokémon */}
              <div
                className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full blur-3xl opacity-35 animate-pulse"
                style={{ backgroundColor: theme.hex }}
              />

              {/* ID de la Pokédex */}
              <span className="text-sm font-mono font-black text-amber-400 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-400/30 mb-2">
                #{String(pokemon.id).padStart(3, "0")}
              </span>

              {/* Nombre Anime del Pokémon */}
              <h2 className="text-3xl sm:text-4xl font-black capitalize tracking-wide drop-shadow-md text-white mb-2">
                {pokemon.name}
              </h2>

              {/* Badges de Tipo */}
              <div className="flex gap-2 flex-wrap justify-center mb-4">
                {(detail?.types || ["normal"]).map((type) => {
                  const t = getTypeTheme(type);
                  return (
                    <span
                      key={type}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-md text-white ${t.badgeBg} border border-white/20`}
                    >
                      {t.label}
                    </span>
                  );
                })}
              </div>

              {/* Imagen en Alta Resolución Oficial */}
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
                <Image
                  src={detail?.artwork || pokemon.artwork || pokemon.image}
                  alt={pokemon.name}
                  width={240}
                  height={240}
                  className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>

              {/* Peso y Altura estilo Pokédex */}
              {detail && (
                <div className="mt-4 flex gap-4 text-xs font-mono text-slate-300 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-700">
                  <div>
                    <span className="text-slate-400 block">ALTURA</span>
                    <span className="font-bold text-white">
                      {(detail.height / 10).toFixed(1)} m
                    </span>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div>
                    <span className="text-slate-400 block">PESO</span>
                    <span className="font-bold text-white">
                      {(detail.weight / 10).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* LADO DERECHO: Radar de Stats + Habilidades heredables */}
            <div className="md:col-span-7 flex flex-col gap-4 bg-slate-950/70 p-4 sm:p-6 rounded-2xl border border-slate-700/60">
              {loading && !detail ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
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
                  {/* Gráfico de Radar de Stats Base */}
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-cyan-400 shadow-sm" />
                        Radar de Estadísticas Base
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        Total:{" "}
                        <strong className="text-white">
                          {detail.stats.reduce((acc, curr) => acc + curr.value, 0)}
                        </strong>
                      </span>
                    </div>

                    <div className="flex justify-center">
                      <RadarChart
                        stats={detail.stats}
                        themeHex={theme.hex}
                      />
                    </div>
                  </div>

                  {/* Sección de Habilidades que puede heredar */}
                  <div className="pt-2 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-amber-400 shadow-sm" />
                      Habilidades (Abilities)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {detail.abilities.map((ability) => (
                        <div
                          key={ability.name}
                          className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                            ability.is_hidden
                              ? "bg-gradient-to-br from-amber-950/40 to-purple-950/30 border-amber-500/50 hover:border-amber-400"
                              : "bg-slate-900/80 border-slate-700/80 hover:border-slate-500"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold capitalize text-sm text-white">
                              {ability.name.replace("-", " ")}
                            </span>
                            {ability.is_hidden ? (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                                ⭐ Oculta (Heredable)
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                Estándar
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
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
