"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { PokemonStat } from "@/lib/pokeapi";
import { STAT_LABELS } from "@/lib/typeTheme";

type RadarChartProps = {
  stats: PokemonStat[];
  pokemonName?: string;
  themeHex?: string;
  compareStats?: PokemonStat[];
  compareName?: string;
  compareThemeHex?: string;
};

const STAT_ORDER = [
  "hp",
  "attack",
  "defense",
  "speed",
  "special-defense",
  "special-attack",
];

const MAX_STAT = 160;
const CENTER_X = 140;
const CENTER_Y = 140;
const RADIUS = 80;

export default function RadarChart({
  stats,
  pokemonName,
  themeHex = "#3B82F6",
  compareStats,
  compareName,
  compareThemeHex = "#F59E0B",
}: RadarChartProps) {
  const statMap = useMemo(() => {
    const map = new Map<string, number>();
    stats.forEach((s) => map.set(s.name, s.value));
    return map;
  }, [stats]);

  const compareStatMap = useMemo(() => {
    if (!compareStats) return null;
    const map = new Map<string, number>();
    compareStats.forEach((s) => map.set(s.name, s.value));
    return map;
  }, [compareStats]);

  // Vértices del Pokémon principal
  const vertices = useMemo(() => {
    return STAT_ORDER.map((statName, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 6;
      const rawVal = statMap.get(statName) ?? 50;
      const normalized = Math.min(Math.max(rawVal / MAX_STAT, 0.12), 1);
      const r = normalized * RADIUS;
      const x = CENTER_X + r * Math.cos(angle);
      const y = CENTER_Y + r * Math.sin(angle);

      // Posición para la etiqueta exterior
      const labelR = RADIUS + 32;
      const labelX = CENTER_X + labelR * Math.cos(angle);
      const labelY = CENTER_Y + labelR * Math.sin(angle);

      const compareRawVal = compareStatMap?.get(statName);

      return {
        statName,
        value: rawVal,
        compareValue: compareRawVal,
        x,
        y,
        labelX,
        labelY,
        angle,
      };
    });
  }, [statMap, compareStatMap]);

  // Vértices del Pokémon rival (comparativa)
  const compareVertices = useMemo(() => {
    if (!compareStatMap) return [];
    return STAT_ORDER.map((statName, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 6;
      const rawVal = compareStatMap.get(statName) ?? 50;
      const normalized = Math.min(Math.max(rawVal / MAX_STAT, 0.12), 1);
      const r = normalized * RADIUS;
      const x = CENTER_X + r * Math.cos(angle);
      const y = CENTER_Y + r * Math.sin(angle);
      return { x, y };
    });
  }, [compareStatMap]);

  const polygonPoints = useMemo(() => {
    return vertices.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(" ");
  }, [vertices]);

  const comparePolygonPoints = useMemo(() => {
    if (compareVertices.length === 0) return "";
    return compareVertices
      .map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`)
      .join(" ");
  }, [compareVertices]);

  // Cuadrícula concéntrica hexagonal (4 niveles)
  const gridRings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="relative flex flex-col items-center justify-center p-2 select-none">
      <svg
        viewBox="0 0 280 280"
        className="w-full max-w-[280px] h-auto drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={themeHex} stopOpacity="0.5" />
            <stop offset="100%" stopColor={themeHex} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="compareRadarFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={compareThemeHex} stopOpacity="0.5" />
            <stop offset="100%" stopColor={compareThemeHex} stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={themeHex} stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Brillo central */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS}
          fill="url(#centerGlow)"
        />

        {/* Anillos concéntricos hexagonales */}
        {gridRings.map((scale, ringIdx) => {
          const ringPoints = STAT_ORDER.map((_, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
            const r = RADIUS * scale;
            const x = CENTER_X + r * Math.cos(angle);
            const y = CENTER_Y + r * Math.sin(angle);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ");

          return (
            <polygon
              key={ringIdx}
              points={ringPoints}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth={scale === 1 ? "1.5" : "1"}
              strokeDasharray={scale === 1 ? "none" : "3,3"}
              className="opacity-60 dark:opacity-30"
            />
          );
        })}

        {/* Ejes radiales desde el centro */}
        {STAT_ORDER.map((_, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
          const endX = CENTER_X + RADIUS * Math.cos(angle);
          const endY = CENTER_Y + RADIUS * Math.sin(angle);
          return (
            <line
              key={i}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={endX}
              y2={endY}
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="opacity-50 dark:opacity-30"
            />
          );
        })}

        {/* Polígono del Pokémon Rival (si está en modo comparativo) */}
        {comparePolygonPoints && (
          <motion.polygon
            points={comparePolygonPoints}
            fill="url(#compareRadarFill)"
            stroke={compareThemeHex}
            strokeWidth="2"
            strokeDasharray="4,2"
            strokeLinejoin="round"
            initial={{ scale: 0.1, transformOrigin: `${CENTER_X}px ${CENTER_Y}px`, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}

        {/* Polígono animado con las estadísticas del Pokémon Principal */}
        <motion.polygon
          points={polygonPoints}
          fill="url(#radarFill)"
          stroke={themeHex}
          strokeWidth="2.5"
          strokeLinejoin="round"
          initial={{ scale: 0.1, transformOrigin: `${CENTER_X}px ${CENTER_Y}px`, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Puntos en cada vértice (Pokémon Principal) */}
        {vertices.map((v, i) => (
          <motion.circle
            key={i}
            cx={v.x}
            cy={v.y}
            r="4"
            fill="#FFFFFF"
            stroke={themeHex}
            strokeWidth="2"
            initial={{ scale: 0, transformOrigin: `${v.x}px ${v.y}px` }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.04, duration: 0.25 }}
          />
        ))}

        {/* Puntos en cada vértice (Pokémon Rival) */}
        {compareVertices.map((v, i) => (
          <motion.circle
            key={`comp-${i}`}
            cx={v.x}
            cy={v.y}
            r="3.5"
            fill={compareThemeHex}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            initial={{ scale: 0, transformOrigin: `${v.x}px ${v.y}px` }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.04, duration: 0.25 }}
          />
        ))}

        {/* Etiquetas de las estadísticas en el exterior */}
        {vertices.map((v, i) => {
          const statLabel = STAT_LABELS[v.statName] || v.statName.toUpperCase();
          const isTop = v.angle === -Math.PI / 2;
          const isBottom = v.angle === Math.PI / 2;
          const isLeft = Math.cos(v.angle) < -0.2;

          let textAnchor: "middle" | "start" | "end" = "middle";
          if (!isTop && !isBottom) {
            textAnchor = isLeft ? "end" : "start";
          }

          const hasCompare = typeof v.compareValue === "number";
          const diff = hasCompare ? v.value - (v.compareValue ?? 0) : 0;

          return (
            <g key={i}>
              <text
                x={v.labelX}
                y={v.labelY - 5}
                textAnchor={textAnchor}
                className="text-[10px] font-bold fill-slate-800 dark:fill-slate-100 tracking-wider uppercase font-mono"
              >
                {statLabel}
              </text>
              <text
                x={v.labelX}
                y={v.labelY + 9}
                textAnchor={textAnchor}
                className="text-[11px] font-extrabold fill-slate-900 dark:fill-white font-mono"
                style={{ fill: themeHex }}
              >
                {v.value}
                {hasCompare && (
                  <tspan
                    dx="4"
                    fill={compareThemeHex}
                    className="font-semibold text-[10px]"
                  >
                    / {v.compareValue}
                  </tspan>
                )}
                {hasCompare && diff !== 0 && (
                  <tspan
                    dx="3"
                    fill={diff > 0 ? "#10B981" : "#EF4444"}
                    className="font-black text-[9px]"
                  >
                    ({diff > 0 ? `+${diff}` : diff})
                  </tspan>
                )}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Leyenda comparativa si hay rival activo */}
      {compareStats && (
        <div className="mt-2 flex items-center justify-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-white"
              style={{ backgroundColor: themeHex }}
            />
            <span className="capitalize font-bold text-slate-200">
              {pokemonName || "Pokémon"}
            </span>
          </div>
          <span className="text-slate-500 font-bold">VS</span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-white"
              style={{ backgroundColor: compareThemeHex }}
            />
            <span className="capitalize font-bold text-slate-200">
              {compareName || "Rival"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
