"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import type { Card } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function WishlistGrid({ cards }: { cards: Card[] }) {
  const { wishlist, ready } = useStore();
  if (!ready) return null;
  const list = cards.filter((c) => wishlist.includes(c.slug));
  if (list.length === 0)
    return (
      <div className="empty">
        <p className="display-s">Список обраного порожній</p>
        <p className="muted">Натисніть ♡ на картці товару, щоб зберегти його тут.</p>
        <Link href="/catalog" className="btn btn-dark">
          До каталогу
        </Link>
      </div>
    );
  return (
    <div className="grid">
      {list.map((c) => (
        <ProductCard key={c.slug} card={c} />
      ))}
    </div>
  );
}
