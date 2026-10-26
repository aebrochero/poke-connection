// lib/exportPokemon.ts

import type { PokemonDetail } from "@/lib/pokeapi";
import { STAT_LABELS } from "@/lib/typeTheme";

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportPokemonAsJSON(pokemon: PokemonDetail): void {
  const payload = {
    pokedex_id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    height_meters: pokemon.height / 10,
    weight_kg: pokemon.weight / 10,
    stats: pokemon.stats.map((s) => ({
      name: s.name,
      label: STAT_LABELS[s.name] || s.name.toUpperCase(),
      base_value: s.value,
    })),
    total_stats: pokemon.stats.reduce((acc, curr) => acc + curr.value, 0),
    abilities: pokemon.abilities.map((a) => ({
      name: a.name,
      is_hidden: a.is_hidden,
    })),
    sprites: {
      default: pokemon.image,
      official_artwork: pokemon.artwork,
    },
    exported_at: new Date().toISOString(),
    source: "Poke Connection Pokédex",
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  triggerDownload(
    jsonStr,
    `pokemon-${String(pokemon.id).padStart(3, "0")}-${pokemon.name}.json`,
    "application/json"
  );
}

export function exportPokemonAsCSV(pokemon: PokemonDetail): void {
  const statMap: Record<string, number> = {};
  pokemon.stats.forEach((s) => {
    statMap[s.name] = s.value;
  });

  const total = pokemon.stats.reduce((acc, curr) => acc + curr.value, 0);
  const types = pokemon.types.join(";");
  const abilities = pokemon.abilities
    .map((a) => `${a.name}${a.is_hidden ? " (Oculta)" : ""}`)
    .join(";");

  const headers = [
    "ID",
    "Nombre",
    "Tipos",
    "Altura (m)",
    "Peso (kg)",
    "PS",
    "Ataque",
    "Defensa",
    "Ataque Especial",
    "Defensa Especial",
    "Velocidad",
    "Total Stats",
    "Habilidades",
  ].join(",");

  const row = [
    pokemon.id,
    `"${pokemon.name}"`,
    `"${types}"`,
    (pokemon.height / 10).toFixed(1),
    (pokemon.weight / 10).toFixed(1),
    statMap["hp"] ?? 0,
    statMap["attack"] ?? 0,
    statMap["defense"] ?? 0,
    statMap["special-attack"] ?? 0,
    statMap["special-defense"] ?? 0,
    statMap["speed"] ?? 0,
    total,
    `"${abilities}"`,
  ].join(",");

  const csvContent = "\uFEFF" + `${headers}\n${row}`;
  triggerDownload(
    csvContent,
    `pokemon-${String(pokemon.id).padStart(3, "0")}-${pokemon.name}.csv`,
    "text/csv;charset=utf-8;"
  );
}

export function exportPokemonAsMarkdown(pokemon: PokemonDetail): void {
  const total = pokemon.stats.reduce((acc, curr) => acc + curr.value, 0);

  const lines = [
    `# Ficha Técnica Pokédex: #${String(pokemon.id).padStart(3, "0")} ${pokemon.name.toUpperCase()}`,
    "",
    `- **Tipos:** ${pokemon.types.map((t) => t.toUpperCase()).join(" / ")}`,
    `- **Altura:** ${(pokemon.height / 10).toFixed(1)} m`,
    `- **Peso:** ${(pokemon.weight / 10).toFixed(1)} kg`,
    `- **Artwork Oficial:** [Ver Imagen](${pokemon.artwork || pokemon.image})`,
    "",
    "## Estadísticas Base",
    "",
    "| Estadística | Sigla | Valor Base |",
    "| :--- | :--- | :--- |",
    ...pokemon.stats.map(
      (s) => `| ${s.name} | ${STAT_LABELS[s.name] || s.name.toUpperCase()} | **${s.value}** |`
    ),
    `| **Total** | **BST** | **${total}** |`,
    "",
    "## Habilidades",
    "",
    ...pokemon.abilities.map(
      (a) =>
        `- **${a.name.replace("-", " ")}** ${
          a.is_hidden ? "*(⭐ Habilidad Oculta Heredable)*" : "*(Estándar)*"
        }`
    ),
    "",
    "---",
    `*Exportado desde Poke Connection Pokédex el ${new Date().toLocaleDateString()}*`,
  ];

  triggerDownload(
    lines.join("\n"),
    `pokemon-${String(pokemon.id).padStart(3, "0")}-${pokemon.name}.md`,
    "text/markdown;charset=utf-8;"
  );
}
