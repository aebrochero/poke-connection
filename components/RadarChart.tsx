"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { PokemonStat } from "@/lib/pokeapi";
import { STAT_LABELS } from "@/lib/typeTheme";

type RadarChartProps = {
  stats: PokemonStat[];
  themeHex?: string;
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
  themeHex = "#3B82F6",
}: RadarChartProps) {
  const statMap = useMemo(() => {
    const map = new Map<string, number>();
    stats.forEach((s) => map.set(s.name, s.value));
    return map;
  }, [stats]);

  // Coordenadas de los 6 vértices
  const vertices = useMemo(() => {
    return STAT_ORDER.map((statName, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 6;
      const rawVal = statMap.get(statName) ?? 50;
      const normalized = Math.min(Math.max(rawVal / MAX_STAT, 0.12), 1);
      const r = normalized * RADIUS;
      const x = CENTER_X + r * Math.cos(angle);
      const y = CENTER_Y + r * Math.sin(angle);

      // Posición para la etiqueta exterior
      const labelR = RADIUS + 28;
      const labelX = CENTER_X + labelR * Math.cos(angle);
      const labelY = CENTER_Y + labelR * Math.sin(angle);

      return {
        statName,
        value: rawVal,
        x,
        y,
        labelX,
        labelY,
        angle,
      };
    });
  }, [statMap]);

  const polygonPoints = useMemo(() => {
    return vertices.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(" ");
  }, [vertices]);

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
            <stop offset="0%" stopColor={themeHex} stopOpacity="0.55" />
            <stop offset="100%" stopColor={themeHex} stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={themeHex} stopOpacity="0.3" />
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
              className="opacity-70 dark:opacity-40"
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
              className="opacity-60 dark:opacity-40"
            />
          );
        })}

        {/* Polígono animado con las estadísticas */}
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

        {/* Puntos en cada vértice */}
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
            transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
          />
        ))}

        {/* Etiquetas de las estadísticas en el exterior */}
        {vertices.map((v, i) => {
          const meta = STAT_LABELS[v.statName] || {
            label: v.statName,
            short: v.statName.toUpperCase(),
          };
          const isTop = v.angle === -Math.PI / 2;
          const isBottom = v.angle === Math.PI / 2;
          const isLeft = Math.cos(v.angle) < -0.2;

          let textAnchor: "middle" | "start" | "end" = "middle";
          if (!isTop && !isBottom) {
            textAnchor = isLeft ? "end" : "start";
          }

          return (
            <g key={i}>
              <text
                x={v.labelX}
                y={v.labelY - 5}
                textAnchor={textAnchor}
                className="text-[10px] font-bold fill-slate-800 dark:fill-slate-100 tracking-wider uppercase font-mono"
              >
                {meta.short}
              </text>
              <text
                x={v.labelX}
                y={v.labelY + 9}
                textAnchor={textAnchor}
                className="text-[11px] font-extrabold fill-slate-900 dark:fill-white font-mono"
                style={{ fill: themeHex }}
              >
                {v.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
