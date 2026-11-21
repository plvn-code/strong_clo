"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { img } from "@/lib/catalog";
import { formatPrice, plural } from "@/lib/format";
import { useStore } from "@/lib/store";
import { IconClose, IconMinus, IconPlus } from "./Icons";

export function BagLines({ compact = false }: { compact?: boolean }) {
  const { bag, setQty, remove, closeBag } = useStore();
  return (
    <ul className={`lines${compact ? " is-compact" : ""}`}>
      {bag.map((l) => (
        <li key={l.key} className="line">
          <Link href={`/product/${l.slug}?colour=${encodeURIComponent(l.colour)}`} className="line-img" onClick={closeBag}>
            <Image src={img(l.photo)} alt={l.name} fill sizes="120px" />
          </Link>
          <div className="line-body">
            <div className="line-top">
              <Link href={`/product/${l.slug}`} className="line-name" onClick={closeBag}>
                {l.name}
              </Link>
              <button className="line-x" aria-label={`Видалити ${l.name}`} onClick={() => remove(l.key)}>
                <IconClose />
              </button>
            </div>
            <p className="line-opt">
              {l.colour} · {l.size}
            </p>
            <div className="line-bottom">
              <div className="qty" role="group" aria-label="Кількість">
                <button aria-label="Менше" onClick={() => setQty(l.key, l.qty - 1)}>
                  <IconMinus />
                </button>
                <span aria-live="polite">{l.qty}</span>
                <button aria-label="Більше" onClick={() => setQty(l.key, l.qty + 1)} disabled={l.qty >= 9}>
                  <IconPlus />
                </button>
              </div>
              <span className="line-price">{formatPrice(l.price * l.qty)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function BagDrawer() {
  const { bag, bagOpen, closeBag, count, total } = useStore();

  useEffect(() => {
    if (!bagOpen) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && closeBag();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [bagOpen, closeBag]);

  return (
    <div className={`drawer${bagOpen ? " is-open" : ""}`} aria-hidden={!bagOpen} inert={!bagOpen}>
      <button className="drawer-scrim" aria-label="Закрити кошик" onClick={closeBag} tabIndex={-1} />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="Кошик">
        <div className="drawer-head">
          <p className="eyebrow">
            Кошик <span>{count > 0 && `${count} ${plural(count, "річ", "речі", "речей")}`}</span>
          </p>
          <button className="ico" aria-label="Закрити" onClick={closeBag}>
            <IconClose />
          </button>
        </div>
        {bag.length === 0 ? (
          <div className="drawer-empty">
            <p className="display-s">Кошик порожній</p>
            <p className="muted">Почніть з новинок сезону — пуховики, костюми та жилети.</p>
            <Link href="/catalog?c=new" className="btn btn-dark" onClick={closeBag}>
              Дивитись новинки
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              <BagLines />
            </div>
            <div className="drawer-foot">
              <div className="sum-row">
                <span>Разом</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <p className="muted small">Доставка Новою поштою за тарифами перевізника. Реквізити для оплати надішле менеджер у Telegram.</p>
              <Link href="/checkout" className="btn btn-dark btn-block" onClick={closeBag}>
                Оформити замовлення
              </Link>
              <Link href="/cart" className="btn btn-line btn-block" onClick={closeBag}>
                Переглянути кошик
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
