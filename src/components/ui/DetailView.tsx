import React, { useEffect, useState } from "react";
import { fetchByUrl, fetchMultipleByUrls } from "../../api/swapi";
import { getSafeImageForItem } from "../../utils/imageProvider";

type Props = {
  resource: string;
  url: string;
};

type Dict = Record<string, any>;

export const DetailView: React.FC<Props> = ({ resource, url }) => {
  const [item, setItem] = useState<Dict | null>(null);
  const [resolved, setResolved] = useState<Record<string, string[] | string>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [fetchedImage, setFetchedImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setErr(null);
      setFetchedImage(null);
      try {
        const data = await fetchByUrl<Dict>(url);
        if (cancelled) return;
        setItem(data);

        const keysToResolve = Object.keys(data).filter((k) => {
          const v = data[k];
          return (
            (Array.isArray(v) &&
              v.length > 0 &&
              typeof v[0] === "string" &&
              v[0].startsWith("http")) ||
            (typeof v === "string" && v.startsWith("http"))
          );
        });

        const resolvedMap: Record<string, any> = {};

        await Promise.all(
          keysToResolve.map(async (k) => {
            const v = data[k];
            if (Array.isArray(v)) {
              if (v.length === 0) {
                resolvedMap[k] = [];
                return;
              }
              const arr = await fetchMultipleByUrls<any>(v);
              resolvedMap[k] = arr.map((x) => x.name ?? x.title ?? String(x));
            } else if (typeof v === "string" && v.startsWith("http")) {
              const single = await fetchByUrl<any>(v);
              resolvedMap[k] = single.name ?? single.title ?? String(single);
            }
          })
        );

        if (cancelled) return;
        setResolved(resolvedMap);

        try {
          const img = await getSafeImageForItem(resource, data);
          if (!cancelled) setFetchedImage(img ?? null);
        } catch {}
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Failed to load details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [url, resource]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-300">Loading details…</div>
    );
  if (err) return <div className="p-6 text-red-400">Error: {err}</div>;
  if (!item)
    return <div className="p-6 text-gray-300">No details available.</div>;

  const title = item.name ?? item.title ?? `${resource}`;
  const imageUrl = fetchedImage ?? null;

  const skipKeys = new Set(["url", "created", "edited"]);

  const renderValue = (k: string, v: any) => {
    if (v == null || v === "") return <span className="text-gray-400">—</span>;
    if (Array.isArray(v)) {
      if (v.length === 0) return <span className="text-gray-400">—</span>;
      return (
        <div className="flex flex-wrap gap-2">
          {v.map((x: any, i: number) => (
            <span key={i} className="px-2 py-1 bg-gray-800 rounded text-sm">
              {x}
            </span>
          ))}
        </div>
      );
    }
    return <span className="text-sm">{String(v)}</span>;
  };

  const entries: [string, any][] = Object.entries(item)
    .filter(([k]) => !skipKeys.has(k))
    .map(([k, v]) => {
      if (resolved[k]) return [k, resolved[k]];
      if (
        Array.isArray(v) &&
        v.length &&
        typeof v[0] === "string" &&
        v[0].startsWith("http")
      ) {
        return [k, resolved[k] ?? []];
      }
      return [k, v];
    });

  const preferredOrder = [
    "name",
    "title",
    "model",
    "manufacturer",
    "birth_year",
    "height",
    "mass",
    "gender",
    "homeworld",
    "climate",
    "terrain",
    "population",
    "classification",
    "designation",
    "eye_color",
    "hair_color",
    "skin_color",
    "length",
    "crew",
    "passengers",
    "starship_class",
    "vehicle_class",
    "films",
    "species",
    "pilots",
  ];

  entries.sort((a, b) => {
    const ai = preferredOrder.indexOf(a[0]);
    const bi = preferredOrder.indexOf(b[0]);
    if (ai === -1 && bi === -1) return a[0].localeCompare(b[0]);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="text-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 w-full md:w-48">
          {imageUrl ? (
            <div className="relative w-full h-48 bg-gray-800 rounded-md overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="w-full h-48 rounded-md bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-gray-300">
              <span className="text-sm uppercase">{title.split(" ")[0]}</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-gray-400 mb-4">
            {item.subtitle ?? item.model ?? ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entries.map(([k, v]) => {
              if (
                k === "films" ||
                k === "species" ||
                k === "pilots" ||
                k === "residents"
              ) {
                if (!v || (Array.isArray(v) && v.length === 0)) return null;
              }
              if (typeof v === "string" && v.startsWith("http")) return null;
              return (
                <div key={k} className="flex flex-col">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    {k.replace(/_/g, " ")}
                  </div>
                  <div className="mt-1">{renderValue(k, v)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
