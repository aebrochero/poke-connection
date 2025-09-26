export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Poke Connection</h1>
      <p className="mt-4 text-lg text-gray-700">
        Bienvenido al proyecto con Next.js + Tailwind 🚀
      </p>
      <button className="mt-6 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
        Conectar con la PokeAPI
      </button>
    </main>
  );
}
