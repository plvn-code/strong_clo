import { PRODUCTS, type CategoryId, type Product } from "@/data/products";

export type { Product, CategoryId };
export { PRODUCTS };

export interface Category {
  id: string;
  /** short label (menu, chips, tiles) */
  name: string;
  /** full title for the catalogue heading / breadcrumbs, when the short label needs context */
  title?: string;
  /** cover photo for tiles (product photo id) */
  cover: number;
  children?: Category[];
}

/** Client's menu structure (2026-11-22). Top level = what the menu, tiles and chips show. */
export const CATEGORIES: Category[] = [
  {
    id: "outerwear",
    name: "Верхній одяг",
    cover: 4011,
    children: [
      { id: "puffers", name: "Пуховики / куртки", title: "Пуховики та куртки", cover: 4013 },
      { id: "vests", name: "Жилетки / бомбери", title: "Жилетки та бомбери", cover: 422 },
    ],
  },
  {
    id: "suits",
    name: "Спортивні костюми",
    cover: 4002,
    children: [
      { id: "suits-demi", name: "Осінь / весна", title: "Костюми осінь / весна", cover: 453 },
      { id: "suits-winter", name: "Зимові", title: "Зимові костюми", cover: 4024 },
    ],
  },
  { id: "shirts", name: "Сорочки", cover: 4014 },
  { id: "tees", name: "Футболки / топи", cover: 305 },
  { id: "longs", name: "Лонги / кофти", cover: 424 },
  { id: "knit", name: "Вʼязані вироби", cover: 4007 },
  { id: "pants", name: "Штани / шорти / лосини", cover: 252 },
];

/** Not in the client's menu, but products keep a valid category page. */
const HIDDEN: Category[] = [{ id: "dresses", name: "Сукні та спідниці", cover: 447 }];

const ALL: Category[] = [...CATEGORIES.flatMap((c) => [c, ...(c.children ?? [])]), ...HIDDEN];

export const findCategory = (id: string) => ALL.find((c) => c.id === id) ?? null;
export const parentOf = (id: string) => CATEGORIES.find((c) => c.children?.some((k) => k.id === id)) ?? null;
export const categoryName = (id: string) => {
  const c = findCategory(id);
  return c ? (c.title ?? c.name) : "";
};

/** the category itself + its children */
const idsOf = (id: string) => {
  const c = findCategory(id);
  return c ? [c.id, ...(c.children ?? []).map((k) => k.id)] : [];
};
export const inCategory = (p: Product, id: string) => {
  const ids = idsOf(id);
  return ids.includes(p.category) || !!p.also?.some((a) => ids.includes(a));
};

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
  else if (q.c) list = list.filter((p) => inCategory(p, q.c!));
  const fam = COLOUR_FAMILIES.find((f) => f.id === q.color);
  if (fam) list = list.filter((p) => p.colours.some((c) => fam.match.test(c.name)));
  if (q.size) list = list.filter((p) => p.sizes.includes(q.size!));
  if (q.q) {
    const s = q.q.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        categoryName(p.category).toLowerCase().includes(s) ||
        (parentOf(p.category)?.name.toLowerCase().includes(s) ?? false) ||
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
