"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { edImg } from "@/lib/catalog";

/** Each slide is a triptych on desktop; phones show only the first frame. */
const SLIDES = [
  { label: "Пуховики", frames: [4011, 4012, 4013], href: "/catalog?c=puffers" },
  { label: "ZIP-костюм на флісі", frames: [352, 678, 392], href: "/product/zip-kostyum-na-flisi" },
  { label: "Костюми AW 26/27", frames: [4024, 4001, 4004], href: "/catalog?c=suits" },
];
const MS = 6000;

export function HeroSlides() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % SLIDES.length), MS);
    return () => window.clearTimeout(t);
  }, [i, paused]);

  return (
    <section className="hero" aria-label="STRONG — новий сезон" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="hero-stage">
        {SLIDES.map((s, k) => (
          <div key={s.label} className={`hero-slide${k === i ? " is-on" : ""}`} aria-hidden={k !== i}>
            {s.frames.map((f, n) => (
              <div key={f} className="hero-frame">
                <Image
                  src={edImg(f)}
                  alt={n === 0 ? `STRONG — ${s.label}` : ""}
                  fill
                  priority={k === 0 && n === 0}
                  sizes={n === 0 ? "(max-width: 760px) 100vw, 34vw" : "34vw"}
                  quality={85}
                  className="hero-img"
                />
              </div>
            ))}
          </div>
        ))}
        <div className="hero-shade" />
      </div>

      <div className="hero-top">
        <span>AW 26/27</span>
        <span className="hero-top-mid">Український бренд одягу</span>
        <span>Since 2021</span>
      </div>

      <div className="hero-copy">
        <h1 className="hero-mast">
          <span className="sr-only">STRONG — український бренд жіночого одягу</span>
          <span aria-hidden>STRONG</span>
        </h1>
        <div className="hero-bar">
          <Link href={SLIDES[i].href} className="hero-label">
            <span className="hero-count">
              {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
            <span>{SLIDES[i].label}</span>
          </Link>
          <div className="hero-ctas">
            <Link href="/catalog?c=new" className="btn btn-light">
              Новинки
            </Link>
            <Link href="/catalog" className="btn btn-ghost-light">
              Каталог
            </Link>
          </div>
        </div>
        <div className="hero-dots" role="tablist" aria-label="Слайди">
          {SLIDES.map((s, k) => (
            <button
              key={s.label}
              role="tab"
              aria-selected={k === i}
              aria-label={s.label}
              className={k === i ? "is-on" : ""}
              onClick={() => setI(k)}
              style={{ "--ms": `${MS}ms` } as React.CSSProperties}
            >
              <i key={k === i ? `on-${i}` : "off"} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
