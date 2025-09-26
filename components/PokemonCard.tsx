// components/PokemonCard.tsx

type PokemonCardProps = {
  name: string;
  image: string;
};

export default function PokemonCard({ name, image }: PokemonCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:scale-105 transition-transform">
      <img src={image} alt={name} className="w-20 h-20 mb-2" />
      <h2 className="capitalize font-semibold text-gray-700">{name}</h2>
    </div>
  );
}
