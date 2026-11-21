"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COLOUR_FAMILIES, SIZES, type Query } from "@/lib/catalog";
import { IconClose } from "@/components/Icons";

const SORTS = [
  { id: "", name: "Рекомендовані" },
  { id: "new", name: "Спершу новинки" },
  { id: "price-asc", name: "Ціна: від нижчої" },
  { id: "price-desc", name: "Ціна: від вищої" },
];

export function CatalogTools({ q }: { q: Query }) {
  const [open, setOpen] = useState(false);
  const [cols, setCols] = useState<1 | 2>(2);

  useEffect(() => {
    document.querySelector("[data-grid]")?.setAttribute("data-cols", String(cols));
  }, [cols]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", open);
    return () => document.documentElement.classList.remove("is-locked");
  }, [open]);

  const link = (patch: Partial<Query>) => {
    const next = { ...q, ...patch };
    const p = new URLSearchParams();
    (Object.keys(next) as (keyof Query)[]).forEach((k) => next[k] && p.set(k, next[k]!));
    const s = p.toString();
    return `/catalog${s ? `?${s}` : ""}`;
  };
  const active = [q.color, q.size, q.sort].filter(Boolean).length;

  return (
    <div className="tools wrap">
      <button className="tools-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
        Фільтри{active > 0 && <sup>{active}</sup>}
      </button>
      <div className="tools-cols" role="group" aria-label="Вигляд сітки">
        <button className={cols === 1 ? "is-on" : ""} aria-label="Одна колонка" aria-pressed={cols === 1} onClick={() => setCols(1)}>
          <i />
        </button>
        <button className={cols === 2 ? "is-on" : ""} aria-label="Дві колонки" aria-pressed={cols === 2} onClick={() => setCols(2)}>
          <i />
          <i />
        </button>
      </div>

      <div className={`sheet${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <button className="sheet-scrim" tabIndex={-1} aria-label="Закрити" onClick={() => setOpen(false)} />
        <div className="sheet-panel" role="dialog" aria-modal="true" aria-label="Фільтри">
          <div className="drawer-head">
            <p className="eyebrow">Фільтри</p>
            <button className="ico" aria-label="Закрити" onClick={() => setOpen(false)}>
              <IconClose />
            </button>
          </div>
          <div className="sheet-body" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
            <fieldset>
              <legend>Колір</legend>
              <div className="opt-row">
                {COLOUR_FAMILIES.map((f) => (
                  <Link key={f.id} href={link({ color: q.color === f.id ? undefined : f.id })} className={`opt${q.color === f.id ? " is-on" : ""}`}>
                    <span className="sw" style={{ "--sw": f.hex } as React.CSSProperties} />
                    {f.name}
                  </Link>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Розмір</legend>
              <div className="opt-row">
                {SIZES.map((s) => (
                  <Link key={s} href={link({ size: q.size === s ? undefined : s })} className={`opt${q.size === s ? " is-on" : ""}`}>
                    {s}
                  </Link>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Сортування</legend>
              <div className="opt-col">
                {SORTS.map((s) => (
                  <Link key={s.id} href={link({ sort: s.id || undefined })} className={`opt-line${(q.sort ?? "") === s.id ? " is-on" : ""}`}>
                    {s.name}
                  </Link>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="sheet-foot">
            <Link href={link({ color: undefined, size: undefined, sort: undefined })} className="btn btn-line" onClick={() => setOpen(false)}>
              Скинути
            </Link>
            <button className="btn btn-dark" onClick={() => setOpen(false)}>
              Показати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
