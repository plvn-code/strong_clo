"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { img, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { useStore } from "@/lib/store";
import { IconArrow, IconCheck, IconClose, IconHeart, IconTelegram } from "@/components/Icons";

export function ProductView({ product: p, category, initialColour }: { product: Product; category: string; initialColour?: string }) {
  const { add, wishlist, toggleWish, ready } = useStore();
  const start = Math.max(0, p.colours.findIndex((c) => c.name === initialColour));
  const [ci, setCi] = useState(start);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [warn, setWarn] = useState(false);
  const [slide, setSlide] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const [showBar, setShowBar] = useState(false);
  const [added, setAdded] = useState(false);
  const gallery = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const colour = p.colours[ci];
  const photos = colour.photos;
  const wished = ready && wishlist.includes(p.slug);

  // keep the URL in sync with the colour (shareable links), without a navigation
  useEffect(() => {
    const url = new URL(window.location.href);
    if (ci === 0) url.searchParams.delete("colour");
    else url.searchParams.set("colour", colour.name);
    window.history.replaceState(null, "", url);
    gallery.current?.scrollTo({ left: 0 });
    setSlide(0);
  }, [ci, colour.name]);

  useEffect(() => {
    const el = buyRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", zoom !== null);
    if (zoom === null) return;
    const el = zoomRef.current;
    if (el) el.scrollLeft = zoom * el.clientWidth;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [zoom]);

  const onScroll = () => {
    const el = gallery.current;
    if (!el) return;
    setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  const buy = () => {
    if (!size) {
      setWarn(true);
      document.getElementById("sizes")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    add({ slug: p.slug, name: p.name, colour: colour.name, size, photo: photos[0], price: p.price });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="pdp">
      <div className="pdp-gallery">
        <div className="pdp-track" ref={gallery} onScroll={onScroll} aria-label={`Фото: ${p.name}, ${colour.name}`}>
          {photos.map((id, i) => (
            <button key={`${colour.name}-${id}`} className="pdp-shot" onClick={() => setZoom(i)} aria-label={`Збільшити фото ${i + 1}`}>
              <Image src={img(id)} alt={i === 0 ? `${p.name}, ${colour.name.toLowerCase()}` : ""} fill priority={i === 0} sizes="(max-width: 960px) 100vw, 30vw" quality={85} className="pdp-img" />
            </button>
          ))}
        </div>
        {photos.length > 1 && (
          <div className="pdp-dots" aria-hidden>
            {photos.map((id, i) => (
              <i key={id} className={i === slide ? "is-on" : ""} />
            ))}
          </div>
        )}
        <span className="pdp-count" aria-hidden>
          {slide + 1} / {photos.length}
        </span>
      </div>

      <div className="pdp-info">
        <div className="pdp-sticky">
          <nav className="crumbs" aria-label="Навігація">
            <Link href="/catalog">Каталог</Link>
            <span>/</span>
            <Link href={`/catalog?c=${p.category}`}>{category}</Link>
          </nav>
          {(p.isNew || p.bestseller) && <p className="pdp-badge">{p.isNew ? "New · AW 26/27" : "Bestseller"}</p>}
          <h1 className="pdp-name">{p.name}</h1>
          <p className="pdp-price">{formatPrice(p.price)}</p>
          <p className="pdp-lead">{p.lead}</p>

          <div className="pdp-opt">
            <p className="pdp-label">
              Колір <span>{colour.name}</span>
            </p>
            <div className="pdp-colours" role="radiogroup" aria-label="Колір">
              {p.colours.map((c, i) => (
                <button key={c.name} role="radio" aria-checked={i === ci} aria-label={c.name} title={c.name} className={`pdp-colour${i === ci ? " is-on" : ""}`} onClick={() => setCi(i)}>
                  <Image src={img(c.photos[0])} alt="" fill sizes="64px" />
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-opt" id="sizes">
            <p className="pdp-label">
              Розмір {warn && !size && <span className="warn">— оберіть розмір</span>}
              <Link href="/info/sizes" className="pdp-guide">
                Таблиця розмірів
              </Link>
            </p>
            <div className="pdp-sizes" role="radiogroup" aria-label="Розмір">
              {p.sizes.map((s) => (
                <button key={s} role="radio" aria-checked={size === s} className={`size${size === s ? " is-on" : ""}`} onClick={() => (setSize(s), setWarn(false))}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-buy" ref={buyRef}>
            <button className={`btn btn-dark btn-block${added ? " is-done" : ""}`} onClick={buy}>
              {added ? (
                <>
                  <IconCheck /> Додано в кошик
                </>
              ) : (
                <>Додати в кошик — {formatPrice(p.price)}</>
              )}
            </button>
            <button className={`btn btn-line btn-square${wished ? " is-on" : ""}`} aria-label={wished ? "Прибрати з обраного" : "Додати в обране"} aria-pressed={wished} onClick={() => toggleWish(p.slug)}>
              <IconHeart filled={wished} />
            </button>
          </div>
          <a className="pdp-ask" href={site.managerUrl} target="_blank" rel="noopener noreferrer">
            <IconTelegram /> Питання щодо розміру чи наявності? Напишіть @{site.manager}
          </a>

          <div className="acc">
            <details open>
              <summary>Деталі та склад</summary>
              <ul className="acc-list">
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
                <li>Колір: {colour.name.toLowerCase()}</li>
              </ul>
            </details>
            <details>
              <summary>Оплата</summary>
              <p>
                Після оформлення замовлення менеджер напише вам у Telegram, підтвердить наявність і надішле реквізити для оплати. Онлайн-оплати на сайті
                немає — ви платите напряму бренду.
              </p>
            </details>
            <details>
              <summary>Доставка</summary>
              <p>Новою поштою по всій Україні — у відділення, поштомат або курʼєром. Номер ТТН надсилаємо після відправки.</p>
            </details>
            <details>
              <summary>Обмін і повернення</summary>
              <p>
                Обмін і повернення можливі для речей без слідів носіння, зі збереженими бирками. Акційні товари обміну та повернення не підлягають — лише
                огляд на пошті. <Link href="/info/returns">Детальніше</Link>
              </p>
            </details>
          </div>
        </div>
      </div>

      <div className={`buybar${showBar ? " is-on" : ""}`} aria-hidden={!showBar}>
        <div className="buybar-info">
          <span>{p.name}</span>
          <span>
            {formatPrice(p.price)} · {size ?? "оберіть розмір"}
          </span>
        </div>
        <button className="btn btn-dark" onClick={buy} tabIndex={showBar ? 0 : -1}>
          {added ? <IconCheck /> : "В кошик"}
        </button>
      </div>

      {zoom !== null && (
        <div className="zoom" role="dialog" aria-modal="true" aria-label="Перегляд фото">
          <button className="zoom-x ico" aria-label="Закрити" onClick={() => setZoom(null)}>
            <IconClose />
          </button>
          <div className="zoom-track" ref={zoomRef}>
            {photos.map((id) => (
              <div key={id} className="zoom-item">
                <Image src={img(id)} alt="" fill sizes="100vw" quality={90} className="zoom-img" />
              </div>
            ))}
          </div>
          <p className="zoom-hint">
            Гортайте <IconArrow />
          </p>
        </div>
      )}
    </div>
  );
}
