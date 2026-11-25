import Image from "next/image";
import Link from "next/link";
import { HeroSlides } from "@/components/HeroSlides";
import { Rail } from "@/components/Rail";
import { ProductCard } from "@/components/ProductCard";
import { IconArrow, IconInstagram, IconTelegram } from "@/components/Icons";
import { Monogram } from "@/components/Monogram";
import { CATEGORIES, PRODUCTS, bestsellers, edImg, getProduct, img, newIn, toCard } from "@/lib/catalog";
import { formatPrice, plural } from "@/lib/format";
import { site } from "@/lib/site";

const PUFFERS = [
  { ed: 3376, slug: "puhovyk-oversize", colour: "Графіт" },
  { ed: 3386, slug: "puhovyk-na-zapakh", colour: "Чорний" },
  { ed: 3396, slug: "puhovyk-barkhatnyi", colour: "Electric blue" },
  { ed: 3411, slug: "puhovyk-transformer", colour: "Айворі" },
];

const INSTA = [3416, 3459, 3548, 3572, 3497, 3329];

export default function Home() {
  const polar = getProduct("kostyum-polar-z-kapiushonom")!;
  const fresh = newIn().map((p) => toCard(p));
  const best = bestsellers().slice(0, 4).map((p) => toCard(p));
  const more = PRODUCTS.filter((p) => !p.isNew && !p.bestseller)
    .slice(0, 8)
    .map((p) => toCard(p));

  return (
    <>
      <HeroSlides />

      {/* ── manifesto ── */}
      <section className="manifesto wrap" data-reveal>
        <p className="eyebrow">STRONG · Est. 2021</p>
        <p className="manifesto-text">
          Ми шиємо речі, в яких <em>тепло</em>, <em>зручно</em> і впевнено — від пуховика на еко-пуху до костюма, який хочеться носити щодня.
        </p>
        <Link href="/about" className="link-arrow">
          Про бренд <IconArrow />
        </Link>
      </section>

      {/* ── new in ── */}
      <section className="sec" aria-labelledby="new-h">
        <div className="wrap sec-head" data-reveal>
          <div>
            <p className="eyebrow">01 — Новий сезон</p>
            <h2 id="new-h" className="display">
              Новинки FW 26/27
            </h2>
          </div>
          <Link href="/catalog?c=new" className="link-arrow">
            Усі новинки <IconArrow />
          </Link>
        </div>
        <Rail cards={[...fresh, ...best.filter((b) => !fresh.some((f) => f.slug === b.slug))]} label="Новинки" />
      </section>

      {/* ── categories ── */}
      <section className="sec wrap" aria-labelledby="cat-h">
        <div className="sec-head" data-reveal>
          <div>
            <p className="eyebrow">02 — Категорії</p>
            <h2 id="cat-h" className="display">
              Гардероб STRONG
            </h2>
          </div>
        </div>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/catalog?c=${c.id}`} className="cat" data-reveal>
              <Image src={img(c.cover)} alt={c.name} fill sizes="(max-width: 760px) 50vw, 25vw" className="cat-img" />
              <span className="cat-name">
                {c.name}
                <IconArrow />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── editorial: the polar fleece suit ── */}
      <section className="story" aria-labelledby="story-h">
        <div className="story-media" data-reveal>
          <Image src={edImg(3311)} alt="Костюм з флісу полар з капюшоном у шоколадному кольорі" fill sizes="(max-width: 960px) 100vw, 55vw" quality={85} className="story-img" />
        </div>
        <div className="story-copy" data-reveal>
          <p className="eyebrow">03 — The Polar Edit</p>
          <h2 id="story-h" className="display display-xl">
            Шоколад,
            <br />
            що гріє
          </h2>
          <p className="story-text">{polar.lead}</p>
          <ul className="story-list">
            {polar.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <div className="story-inset">
            <Image src={edImg(3314)} alt="" fill sizes="200px" className="story-img" />
          </div>
          <div className="story-buy">
            <span>{formatPrice(polar.price)}</span>
            <Link href={`/product/${polar.slug}`} className="btn btn-light">
              Обрати колір
            </Link>
          </div>
        </div>
      </section>

      {/* ── bestsellers ── */}
      <section className="sec wrap" aria-labelledby="best-h">
        <div className="sec-head" data-reveal>
          <div>
            <p className="eyebrow">04 — Вибір покупниць</p>
            <h2 id="best-h" className="display">
              Бестселери
            </h2>
          </div>
          <Link href="/catalog?c=bestsellers" className="link-arrow">
            Дивитись усі <IconArrow />
          </Link>
        </div>
        <div className="grid">
          {best.map((c) => (
            <ProductCard key={c.slug} card={c} />
          ))}
        </div>
      </section>

      {/* ── puffers lookbook ── */}
      <section className="look" aria-labelledby="look-h">
        <div className="wrap sec-head" data-reveal>
          <div>
            <p className="eyebrow">05 — Зима</p>
            <h2 id="look-h" className="display">
              Пуховики STRONG
            </h2>
          </div>
          <p className="look-note">Еко-пух, вологостійка тканина, металева фурнітура, капюшон на кнопках. Лакові, бархатні, трансформери 2в1.</p>
        </div>
        <div className="look-track">
          {PUFFERS.map((f) => {
            const p = getProduct(f.slug)!;
            return (
              <Link key={f.ed} href={`/product/${p.slug}?colour=${encodeURIComponent(f.colour)}`} className="look-item" data-reveal>
                <div className="look-media">
                  <Image src={edImg(f.ed)} alt={`${p.name}, ${f.colour.toLowerCase()}`} fill sizes="(max-width: 760px) 82vw, 25vw" className="look-img" />
                </div>
                <div className="look-cap">
                  <span>
                    {p.name}
                    <em>{f.colour}</em>
                  </span>
                  <span>{formatPrice(p.price)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── details ── */}
      <section className="detail wrap" aria-labelledby="detail-h">
        <div className="detail-media" data-reveal>
          <Image src={edImg(3310)} alt="Фірмова вишивка STRONG на костюмі з флісу полар" fill sizes="(max-width: 960px) 100vw, 45vw" className="story-img" />
        </div>
        <div className="detail-copy" data-reveal>
          <Monogram className="detail-mono" />
          <p className="eyebrow">06 — Деталі</p>
          <h2 id="detail-h" className="display">
            Власне виробництво.
            <br />
            Без компромісів.
          </h2>
          <p className="muted">
            Ми самі відшиваємо кожну модель: тринитка пеньє з бавовни, фліс, що не кошлатиться, еко-пух і вологостійка плащівка, металева фурнітура
            та вишита монограма SS.
          </p>
          <dl className="facts">
            <div>
              <dt>2021</dt>
              <dd>власне виробництво</dd>
            </div>
            <div>
              <dt>{site.instagramFollowers}</dt>
              <dd>у нашому Instagram</dd>
            </div>
            <div>
              <dt>{PRODUCTS.length}</dt>
              <dd>{plural(PRODUCTS.length, "модель", "моделі", "моделей")} у каталозі</dd>
            </div>
            <div>
              <dt>Еко-пух</dt>
              <dd>у пуховиках і жилетах</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── more ── */}
      <section className="sec" aria-labelledby="more-h">
        <div className="wrap sec-head" data-reveal>
          <div>
            <p className="eyebrow">07 — Каталог</p>
            <h2 id="more-h" className="display">
              Жилети, костюми, база
            </h2>
          </div>
          <Link href="/catalog" className="link-arrow">
            Весь каталог <IconArrow />
          </Link>
        </div>
        <Rail cards={more} label="Каталог" />
      </section>

      {/* ── how to order ── */}
      <section className="steps-sec" aria-labelledby="steps-h">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">08 — Як замовити</p>
              <h2 id="steps-h" className="display">
                Три кроки до вашої речі
              </h2>
            </div>
          </div>
          <ol className="steps">
            <li data-reveal>
              <span className="step-n">01</span>
              <p className="step-t">Оформіть замовлення</p>
              <p className="muted">Оберіть модель, колір і розмір — та залиште контакти в кошику. Це займає хвилину.</p>
            </li>
            <li data-reveal>
              <span className="step-n">02</span>
              <p className="step-t">Отримайте реквізити</p>
              <p className="muted">Менеджер @{site.manager} напише вам у Telegram, підтвердить наявність і надішле реквізити для оплати.</p>
            </li>
            <li data-reveal>
              <span className="step-n">03</span>
              <p className="step-t">Чекайте посилку</p>
              <p className="muted">Відправляємо Новою поштою по всій Україні та надсилаємо номер ТТН.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ── instagram ── */}
      <section className="insta" aria-labelledby="insta-h">
        <div className="wrap sec-head" data-reveal>
          <div>
            <p className="eyebrow">
              <IconInstagram /> @{site.instagram}
            </p>
            <h2 id="insta-h" className="display">
              {site.instagramFollowers} дівчат уже з нами
            </h2>
          </div>
          <div className="insta-links">
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
              Instagram <IconArrow />
            </a>
            <a href={site.telegramChannelUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
              <IconTelegram /> Telegram-канал
            </a>
          </div>
        </div>
        <div className="insta-grid">
          {INSTA.map((id) => (
            <a key={id} href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="insta-item" aria-label="STRONG в Instagram">
              <Image src={edImg(id)} alt="" fill sizes="(max-width: 760px) 50vw, 17vw" className="story-img" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
