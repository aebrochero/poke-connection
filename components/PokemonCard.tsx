import Image from "next/image";

type PokemonCardProps = {
  name: string;
  image: string;
};

export default function PokemonCard({ name, image }: PokemonCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:scale-105 transition-transform">
      <Image
        src={image}
        alt={name}
        width={80}
        height={80}
        className="w-20 h-20 mb-2 object-contain"
        priority={false}
      />
      <h2 className="capitalize font-semibold text-gray-700">{name}</h2>
    </div>
  );
}
