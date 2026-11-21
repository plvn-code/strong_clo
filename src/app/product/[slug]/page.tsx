import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "./ProductView";
import { Rail } from "@/components/Rail";
import { PRODUCTS, categoryName, getProduct, img, related, toCard } from "@/lib/catalog";

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.lead} ${p.details.join(". ")}.`,
    openGraph: { title: `${p.name} — STRONG`, images: [img(p.colours[0].photos[0])] },
  };
}

export default async function ProductPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const sp = await searchParams;
  const colour = typeof sp.colour === "string" ? sp.colour : undefined;
  const rel = related(p).map((x) => toCard(x));

  return (
    <>
      <ProductView product={p} category={categoryName(p.category)} initialColour={colour} />
      <section className="sec" aria-labelledby="rel-h">
        <div className="wrap sec-head">
          <div>
            <p className="eyebrow">Доповніть образ</p>
            <h2 id="rel-h" className="display">
              Вам також сподобається
            </h2>
          </div>
        </div>
        <Rail cards={rel} label="Схожі товари" />
      </section>
    </>
  );
}
