export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Cargando Pokémon...</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full max-w-5xl">
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={index}
            className="bg-white/70 animate-pulse rounded-xl p-4 h-32 flex flex-col items-center justify-center shadow-sm"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
            <div className="w-20 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}
