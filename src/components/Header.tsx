"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES, PRODUCTS, img } from "@/lib/catalog";
import { site } from "@/lib/site";
import { useStore } from "@/lib/store";
import { IconBag, IconHeart, IconInstagram, IconSearch, IconTelegram } from "./Icons";
import { Monogram } from "./Monogram";

const NOTES = [
  "Замовлення на сайті — реквізити для оплати менеджер надішле в Telegram",
  "Власне виробництво з 2021 року",
  "Доставка Новою поштою по всій Україні",
];

const NAV = [
  { href: "/catalog?c=new", label: "Новинки" },
  { href: "/catalog?c=puffers", label: "Пуховики" },
  { href: "/catalog?c=suits", label: "Костюми" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "Про бренд" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, openBag, wishlist, ready } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hover, setHover] = useState<number>(CATEGORIES[0].cover);
  const [q, setQ] = useState("");
  const overHero = pathname === "/" || pathname === "/about";

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-menu", menu);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menu]);

  const solid = !overHero || scrolled || menu;
  const counts = (id: string) => PRODUCTS.filter((p) => p.category === id).length;

  return (
    <>
      <div className="note-bar" aria-label="Оголошення">
        <div className="note-track">
          {[...NOTES, ...NOTES].map((n, i) => (
            <span key={i} aria-hidden={i >= NOTES.length}>
              {n}
            </span>
          ))}
        </div>
      </div>

      <header className={`hdr${solid ? " is-solid" : ""}${menu ? " is-open" : ""}`}>
        <div className="hdr-row">
          <div className="hdr-left">
            <button className="burger" aria-label={menu ? "Закрити меню" : "Меню"} aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
              <span />
              <span />
            </button>
            <nav className="hdr-nav" aria-label="Основне меню">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="hdr-logo" aria-label="STRONG — на головну">
            <Monogram className="hdr-mono" />
            <span className="hdr-word">STRONG</span>
          </Link>

          <div className="hdr-right">
            <button className="ico hide-s" aria-label="Пошук" onClick={() => setMenu(true)}>
              <IconSearch />
            </button>
            <Link href="/wishlist" className="ico" aria-label="Обране">
              <IconHeart />
              {ready && wishlist.length > 0 && <i className="dot">{wishlist.length}</i>}
            </Link>
            <button className="ico" aria-label={`Кошик, товарів: ${count}`} onClick={openBag}>
              <IconBag />
              {ready && count > 0 && <i className="dot">{count}</i>}
            </button>
          </div>
        </div>
      </header>

      <div className={`menu${menu ? " is-open" : ""}`} aria-hidden={!menu} inert={!menu}>
        <div className="menu-inner">
          <div className="menu-main">
            <form
              className="menu-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/catalog${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
                setMenu(false);
              }}
            >
              <IconSearch />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Пошук: пуховик, костюм, шоколадний…" aria-label="Пошук" />
            </form>

            <nav className="menu-links" aria-label="Категорії">
              <Link href="/catalog?c=new" className="menu-link" onMouseEnter={() => setHover(4013)}>
                <span>Новинки</span>
                <em>AW 26/27</em>
              </Link>
              {CATEGORIES.map((c) => (
                <Link key={c.id} href={`/catalog?c=${c.id}`} className="menu-link" onMouseEnter={() => setHover(c.cover)}>
                  <span>{c.name}</span>
                  <em>{counts(c.id)}</em>
                </Link>
              ))}
              <Link href="/catalog" className="menu-link" onMouseEnter={() => setHover(4024)}>
                <span>Весь каталог</span>
                <em>{PRODUCTS.length}</em>
              </Link>
            </nav>

            <div className="menu-sub">
              <Link href="/about">Про бренд</Link>
              <Link href="/info/delivery">Доставка та оплата</Link>
              <Link href="/info/returns">Обмін і повернення</Link>
              <Link href="/info/sizes">Розміри</Link>
              <Link href="/info/contacts">Контакти</Link>
            </div>

            <div className="menu-social">
              <a href={site.managerUrl} target="_blank" rel="noopener noreferrer">
                <IconTelegram /> @{site.manager}
              </a>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
                <IconInstagram /> @{site.instagram}
              </a>
            </div>
          </div>

          <div className="menu-visual" aria-hidden>
            <Image key={hover} src={img(hover)} alt="" fill sizes="40vw" className="menu-img" />
            <Monogram className="menu-mono" />
          </div>
        </div>
      </div>
    </>
  );
}
