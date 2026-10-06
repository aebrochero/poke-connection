"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Error al cargar los Pokémon</h2>
      <p className="text-gray-600 mb-6">
        {error.message || "Ocurrió un problema de conexión con la PokeAPI."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow"
      >
        Reintentar
      </button>
    </main>
  );
}
