import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/Monogram";
import { IconArrow, IconTelegram } from "@/components/Icons";
import { edImg } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Про бренд", description: site.description };

export default function AboutPage() {
  return (
    <div className="about">
      <section className="about-hero">
        <Image src={edImg(391)} alt="STRONG — ZIP-костюм на флісі" fill priority sizes="100vw" quality={85} className="story-img" />
        <div className="about-hero-copy">
          <Monogram className="about-mono" />
          <p className="eyebrow">Про бренд</p>
          <h1 className="hero-mast is-sm">STRONG</h1>
        </div>
      </section>

      <section className="wrap about-intro" data-reveal>
        <p className="manifesto-text">
          STRONG — український бренд жіночого одягу з <em>власним виробництвом</em> з 2021 року. Ми створюємо речі, які носять щодня: теплі, зручні й
          стильні.
        </p>
      </section>

      <section className="wrap about-cols">
        <div data-reveal>
          <p className="eyebrow">01 — Виробництво</p>
          <h2 className="display">Шиємо самі</h2>
          <p className="muted">
            Кожна модель STRONG відшивається на нашому виробництві. Ми самі обираємо тканини — тринитку пеньє з високим вмістом бавовни, фліс, що не
            кошлатиться після прання, вологостійку плащівку й еко-пух — і контролюємо кожен шов.
          </p>
        </div>
        <div data-reveal>
          <p className="eyebrow">02 — Стиль</p>
          <h2 className="display">Спокійна база</h2>
          <p className="muted">
            Шоколадний, молочний, графіт, мокко, бордо — відтінки, які легко поєднуються між собою. Вільні та оверсайз-силуети, вкорочені кофти, прямі
            штани, обʼємні пуховики.
          </p>
        </div>
        <div data-reveal>
          <p className="eyebrow">03 — Комʼюніті</p>
          <h2 className="display">Разом з вами</h2>
          <p className="muted">
            {site.instagramFollowers} підписниць в Instagram і закритий Telegram-канал, де ми радимося щодо нових відтінків і моделей та першими
            публікуємо розпродажі.
          </p>
        </div>
      </section>

      <section className="about-pair">
        <div className="about-pair-img" data-reveal>
          <Image src={edImg(4004)} alt="Костюм Teddy у молочному кольорі" fill sizes="(max-width: 760px) 100vw, 50vw" className="story-img" />
        </div>
        <div className="about-pair-img" data-reveal>
          <Image src={edImg(360)} alt="Пуховик STRONG у шоколадному кольорі" fill sizes="(max-width: 760px) 100vw, 50vw" className="story-img" />
        </div>
      </section>

      <section className="wrap about-b2b" data-reveal>
        <div>
          <p className="eyebrow">Опт і пошив</p>
          <h2 className="display">Співпраця з брендом</h2>
          <p className="muted">
            Працюємо з оптовими партнерами та шиємо під ключ ваші моделі будь-якої складності. Пишіть у канал «Strong | ОПТ» або в Instagram @
            {site.cooperationInstagram}.
          </p>
        </div>
        <div className="about-b2b-ctas">
          <a href={site.wholesaleUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            <IconTelegram /> Strong | ОПТ
          </a>
          <Link href="/catalog" className="link-arrow">
            До каталогу <IconArrow />
          </Link>
        </div>
      </section>
    </div>
  );
}
