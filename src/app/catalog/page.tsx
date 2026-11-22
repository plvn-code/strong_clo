import type { Metadata } from "next";
import Link from "next/link";
import { CatalogTools } from "./CatalogTools";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, categoryName, findCategory, parentOf, query, toCard, type Query } from "@/lib/catalog";
import { plural } from "@/lib/format";

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

function titleFor(q: Query) {
  if (q.q) return `Пошук: ${q.q}`;
  if (q.c === "new") return "Новинки";
  if (q.c === "bestsellers") return "Бестселери";
  if (q.c) return categoryName(q.c) || "Каталог";
  return "Каталог";
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  return { title: titleFor({ c: one(sp.c), q: one(sp.q) }) };
}

export default async function CatalogPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q: Query = { c: one(sp.c), color: one(sp.color), size: one(sp.size), sort: one(sp.sort), q: one(sp.q)?.slice(0, 60) };
  const list = query(q);
  const chips = [{ id: "", name: "Усе" }, { id: "new", name: "Новинки" }, ...CATEGORIES, { id: "bestsellers", name: "Бестселери" }];
  // second row of chips inside «Верхній одяг» / «Спортивні костюми»
  const group = q.c ? (findCategory(q.c)?.children ? findCategory(q.c) : parentOf(q.c)) : null;
  const topOn = (id: string) => (q.c ?? "") === id || group?.id === id;
  const href = (c: string) => {
    const p = new URLSearchParams();
    if (c) p.set("c", c);
    for (const k of ["color", "size", "sort"] as const) if (q[k]) p.set(k, q[k]!);
    const s = p.toString();
    return `/catalog${s ? `?${s}` : ""}`;
  };

  return (
    <div className="catalog">
      <header className="cat-head wrap">
        <p className="eyebrow">
          STRONG · {list.length} {plural(list.length, "модель", "моделі", "моделей")}
        </p>
        <h1 className="display display-xl">{titleFor(q)}</h1>
      </header>

      <div className="cat-bar">
        <nav className="chips wrap" aria-label="Категорії">
          {chips.map((c) => {
            const on = topOn(c.id);
            const n = c.id === "" ? PRODUCTS.length : undefined;
            return (
              <Link key={c.id || "all"} href={href(c.id)} className={`chip${on ? " is-on" : ""}`} aria-current={on ? "page" : undefined}>
                {c.name}
                {n != null && <sup>{n}</sup>}
              </Link>
            );
          })}
        </nav>
        {group?.children && (
          <nav className="subchips wrap" aria-label={group.name}>
            {[{ id: group.id, name: "Усе" }, ...group.children].map((c) => {
              const on = q.c === c.id;
              return (
                <Link key={c.id} href={href(c.id)} className={`subchip${on ? " is-on" : ""}`} aria-current={on ? "page" : undefined}>
                  {c.name}
                </Link>
              );
            })}
          </nav>
        )}
        <CatalogTools q={q} />
      </div>

      <div className="wrap">
        {list.length === 0 ? (
          <div className="empty">
            <p className="display-s">Нічого не знайшли</p>
            <p className="muted">Спробуйте інший запит або скиньте фільтри.</p>
            <Link href="/catalog" className="btn btn-dark">
              Весь каталог
            </Link>
          </div>
        ) : (
          <div className="grid cat-grid" data-grid>
            {list.map((p, i) => (
              <ProductCard key={p.slug} card={toCard(p)} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
