import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <h1 className="text-4xl font-bold text-blue-600">Poke Connection</h1>
      <p className="mt-4 text-lg text-gray-700">
        Bienvenido al proyecto con Next.js + Tailwind 🚀
      </p>
      <Link
        href="/pokemon-list"
        className="mt-6 inline-block px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-md transition-all hover:scale-105"
      >
        Ver Pokémon
      </Link>
    </main>
  );
}
