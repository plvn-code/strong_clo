"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { img, type Card } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { IconHeart } from "./Icons";

export function ProductCard({ card, priority = false, sizes = "(max-width: 760px) 50vw, 25vw" }: { card: Card; priority?: boolean; sizes?: string }) {
  const { wishlist, toggleWish, ready } = useStore();
  const [colour, setColour] = useState(0);
  const main = colour === 0 ? card.photos[0] : card.colours[colour].photo;
  const second = colour === 0 ? card.photos[1] : null;
  const href = `/product/${card.slug}${colour ? `?colour=${encodeURIComponent(card.colours[colour].name)}` : ""}`;
  const wished = ready && wishlist.includes(card.slug);

  return (
    <article className="card">
      <Link href={href} className="card-media" aria-label={card.name}>
        <Image src={img(main)} alt={card.name} fill sizes={sizes} priority={priority} className="card-img" />
        {second && <Image src={img(second)} alt="" fill sizes={sizes} className="card-img card-img-2" aria-hidden />}
        {card.badge && <span className="card-badge">{card.badge}</span>}
      </Link>
      <button className={`card-wish${wished ? " is-on" : ""}`} aria-label={wished ? "Прибрати з обраного" : "Додати в обране"} aria-pressed={wished} onClick={() => toggleWish(card.slug)}>
        <IconHeart filled={wished} />
      </button>
      <div className="card-body">
        <Link href={href} className="card-name">
          {card.name}
        </Link>
        <div className="card-meta">
          <span className="card-price">{formatPrice(card.price)}</span>
          {card.colours.length > 1 && (
            <span className="card-swatches" role="group" aria-label="Кольори">
              {card.colours.slice(0, 5).map((c, i) => (
                <button
                  key={c.name}
                  className={`sw${i === colour ? " is-on" : ""}`}
                  style={{ "--sw": c.hex } as React.CSSProperties}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setColour(i)}
                />
              ))}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
