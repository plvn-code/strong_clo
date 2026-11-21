import { PRODUCTS, type CategoryId, type Product } from "@/data/products";

export type { Product, CategoryId };
export { PRODUCTS };

export interface Category {
  id: CategoryId;
  name: string;
  /** cover photo for tiles/menu (product photo id) */
  cover: number;
}

export const CATEGORIES: Category[] = [
  { id: "puffers", name: "Пуховики", cover: 4011 },
  { id: "suits", name: "Костюми", cover: 4002 },
  { id: "vests", name: "Жилети", cover: 422 },
  { id: "jackets", name: "Бомбери та куртки", cover: 374 },
  { id: "shirts", name: "Сорочки", cover: 4014 },
  { id: "knit", name: "Трикотаж", cover: 4007 },
  { id: "dresses", name: "Сукні та спідниці", cover: 447 },
  { id: "summer", name: "Літо та база", cover: 305 },
];

export const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? "";

export const img = (id: number) => `/images/p/${id}.webp`;
export const edImg = (id: number) => `/images/ed/${id}.webp`;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function colourOf(p: Product, name?: string | null) {
  return p.colours.find((c) => c.name === name) ?? p.colours[0];
}

export const newIn = () => PRODUCTS.filter((p) => p.isNew);
export const bestsellers = () => PRODUCTS.filter((p) => p.bestseller);

export function related(p: Product, n = 8) {
  const same = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category);
  const rest = PRODUCTS.filter((x) => x.slug !== p.slug && x.category !== p.category && (x.isNew || x.bestseller));
  return [...same, ...rest].slice(0, n);
}

/** Colour families for the catalogue filter */
export const COLOUR_FAMILIES = [
  { id: "black", name: "Чорний", hex: "#0d0d0d", match: /чорн/i },
  { id: "milk", name: "Молочний / білий", hex: "#efe9de", match: /молочн|біл/i },
  { id: "brown", name: "Шоколад / мокко", hex: "#4a3226", match: /шоколад|мокко/i },
  { id: "red", name: "Бордо / burgundy", hex: "#5e1420", match: /бордо|burgundy|бургунд/i },
  { id: "grey", name: "Сірий / графіт", hex: "#6f6f6f", match: /сір|графіт/i },
  { id: "beige", name: "Бежевий", hex: "#cdb89c", match: /беж/i },
] as const;

export const SIZES = ["XS/S", "M/L", "One size"] as const;

export interface Query {
  c?: string;
  color?: string;
  size?: string;
  sort?: string;
  q?: string;
}

export function query(q: Query) {
  let list = [...PRODUCTS];
  if (q.c === "new") list = list.filter((p) => p.isNew);
  else if (q.c === "bestsellers") list = list.filter((p) => p.bestseller);
  else if (q.c) list = list.filter((p) => p.category === q.c);
  const fam = COLOUR_FAMILIES.find((f) => f.id === q.color);
  if (fam) list = list.filter((p) => p.colours.some((c) => fam.match.test(c.name)));
  if (q.size) list = list.filter((p) => p.sizes.includes(q.size!));
  if (q.q) {
    const s = q.q.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        categoryName(p.category).toLowerCase().includes(s) ||
        p.colours.some((c) => c.name.toLowerCase().includes(s)),
    );
  }
  if (q.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (q.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (q.sort === "new") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  return list;
}

/** Light card model passed to client components */
export interface Card {
  slug: string;
  name: string;
  price: number;
  photos: [number, number | null];
  colours: { name: string; hex: string; photo: number }[];
  badge: string | null;
}

export function toCard(p: Product, colour?: string): Card {
  const c = colourOf(p, colour);
  return {
    slug: p.slug,
    name: p.name,
    price: p.price,
    photos: [c.photos[0], c.photos[1] ?? p.colours[1]?.photos[0] ?? null],
    colours: p.colours.map((x) => ({ name: x.name, hex: x.hex, photo: x.photos[0] })),
    badge: p.isNew ? "New" : p.bestseller ? "Bestseller" : null,
  };
}
