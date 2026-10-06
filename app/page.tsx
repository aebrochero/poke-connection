import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Resplandores de fondo anime */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Tarjeta central Pokédex Hero */}
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center bg-slate-900/80 border-4 border-slate-700/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl">
        {/* Lente Pokédex superior */}
        <div className="w-20 h-20 rounded-full bg-sky-400 border-4 border-white shadow-[0_0_30px_rgba(56,189,248,0.9)] mb-6 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-2 left-3 w-6 h-6 rounded-full bg-white/70 blur-[1px]" />
          <div className="w-10 h-10 rounded-full bg-blue-600/40 animate-pulse" />
        </div>

        {/* Título Estilo Pokémon */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-[0_4px_16px_rgba(250,204,21,0.5)]">
          POKÉ CONNECTION
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-lg font-medium">
          Explora la <strong>1era Generación de Kanto (151 Pokémon)</strong> en la
          Pokédex interactiva con análisis de estadísticas por radar, tipos elementales y habilidades heredables.
        </p>

        {/* Badges de características */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
            🔥 151 Pokémon Gen 1
          </span>
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
            ⚡ Paginación 20 por página
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            📊 Gráficos de Radar
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
            🧬 Habilidades Heredables
          </span>
        </div>

        {/* Botón de Entrada Principal */}
        <Link
          href="/pokemon-list"
          className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-lg tracking-wider uppercase border-2 border-red-400 shadow-[0_10px_25px_rgba(239,68,68,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Abrir Pokédex</span>
          <span className="text-xl">➔</span>
        </Link>
      </div>
    </main>
  );
}
