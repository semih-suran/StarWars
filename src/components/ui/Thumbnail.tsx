import React, { useEffect, useState } from "react";
import { getSafeImageForItem } from "../../utils/imageProvider";

type Props = {
  resource: string;
  item: any;
  className?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
};

const cache = new Map<string, string | null>();

export const Thumbnail: React.FC<Props> = ({
  resource,
  item,
  className = "",
  alt,
  size = "md",
}) => {
  const [src, setSrc] = useState<string | null>(() => {
    const key = item?.url ?? item?.name ?? "";
    return cache.get(key) ?? null;
  });
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const key = item?.url ?? item?.name ?? "";
    if (!key) return;

    if (cache.has(key)) {
      setSrc(cache.get(key) ?? null);
      return;
    }

    (async () => {
      try {
        const img = await getSafeImageForItem(resource, item);
        if (cancelled) return;
        cache.set(key, img ?? null);
        setSrc(img ?? null);
      } catch {
        cache.set(key, null);
        if (!cancelled) setSrc(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resource, item]);

  const sizes: Record<string, string> = {
    sm: "h-28",
    md: "h-40",
    lg: "h-56",
  };

  const sizeClass = sizes[size] ?? sizes.md;

  const title = (item?.name ?? item?.title ?? "").toString();

  return (
    <div
      className={`relative w-full ${sizeClass} aspect-[4/5] bg-gray-800 rounded-md flex items-center justify-center overflow-hidden ${className}`}
    >
      {src && !errored ? (
        <img
          src={src}
          alt={alt ?? title ?? "image"}
          className="w-full h-full object-contain p-2"
          onError={() => setErrored(true)}
          loading="lazy"
        />
      ) : (
        <div className="text-gray-300 text-sm uppercase">
          {title ? title.split(" ")[0] : "N/A"}
        </div>
      )}
    </div>
  );
};

export default Thumbnail;
