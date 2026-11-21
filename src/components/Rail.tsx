"use client";

import { useRef } from "react";
import type { Card } from "@/lib/catalog";
import { IconArrow } from "./Icons";
import { ProductCard } from "./ProductCard";

/** Horizontal product rail: swipe on phones, arrows on desktop. */
export function Rail({ cards, label }: { cards: Card[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className="rail">
      <div className="rail-track" ref={ref} role="list" aria-label={label}>
        {cards.map((c) => (
          <div className="rail-item" role="listitem" key={c.slug}>
            <ProductCard card={c} sizes="(max-width: 760px) 70vw, 24vw" />
          </div>
        ))}
      </div>
      <div className="rail-nav">
        <button className="rail-btn is-prev" aria-label="Назад" onClick={() => go(-1)}>
          <IconArrow />
        </button>
        <button className="rail-btn" aria-label="Далі" onClick={() => go(1)}>
          <IconArrow />
        </button>
      </div>
    </div>
  );
}
