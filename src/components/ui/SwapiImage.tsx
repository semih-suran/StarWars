import React from "react";

interface SwapiImageProps {
  category: "characters" | "planets" | "species" | "starships" | "vehicles";
  id: string;
  name: string;
}

export const SwapiImage: React.FC<SwapiImageProps> = ({
  category,
  id,
  name,
}) => {
  const visualGuideUrl = `https://starwars-visualguide.com/assets/img/${category}/${id}.jpg`;
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=1c1c1c&color=FFE81F&size=256&bold=true`;

  return (
    <div className="h-48 w-full overflow-hidden bg-gray-900 border-b border-gray-700">
      <img
        src={visualGuideUrl}
        alt={name}
        className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity"
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.src !== fallbackUrl) img.src = fallbackUrl;
        }}
      />
    </div>
  );
};
