export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 py-8 px-3 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl bg-gradient-to-b from-red-600 via-red-500 to-red-700 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-800 animate-pulse">
        {/* Cabecera Pokédex */}
        <div className="flex items-center gap-3 pb-6 border-b-4 border-red-800/80 mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-400 border-4 border-white shadow-[0_0_20px_rgba(56,189,248,0.8)]" />
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-white" />
            <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-white" />
            <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
        </div>

        {/* Pantalla central skeleton */}
        <div className="bg-slate-900 rounded-2xl p-6 border-4 border-slate-700 shadow-inner">
          <div className="h-6 w-48 bg-slate-800 rounded-lg mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-2xl p-4 h-44 flex flex-col items-center justify-center gap-3 border border-slate-700"
              >
                <div className="w-20 h-20 bg-slate-700 rounded-full" />
                <div className="w-24 h-4 bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
