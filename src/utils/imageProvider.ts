type AkababCharacter = {
  id: number;
  name: string;
  image: string;
};

const AKABAB_INDEX_URL = "https://akabab.github.io/starwars-api/api/all.json";

let akababIndexPromise: Promise<AkababCharacter[]> | null = null;
let akababByName: Record<string, AkababCharacter> | null = null;

async function loadAkababIndex(): Promise<AkababCharacter[]> {
  if (akababIndexPromise) return akababIndexPromise;
  akababIndexPromise = fetch(AKABAB_INDEX_URL, { cache: "force-cache" })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load akabab index");
      return res.json() as Promise<AkababCharacter[]>;
    })
    .then((list) => {
      akababByName = {};
      list.forEach((c) => {
        akababByName![c.name.toLowerCase()] = c;
      });
      return list;
    })
    .catch((err) => {
      akababIndexPromise = null;
      akababByName = null;
      throw err;
    });
  return akababIndexPromise;
}

export async function getSafeImageForItem(
  resource: string,
  item: any
): Promise<string | null> {
  if (!item) return null;

  if (resource === "people") {
    const name = (item.name || "").toString().trim().toLowerCase();
    if (!name) return null;
    try {
      if (!akababByName) await loadAkababIndex();
      const found = akababByName?.[name];
      if (found && found.image) return found.image;
    } catch (e) {
      return null;
    }
  }
  return null;
}
