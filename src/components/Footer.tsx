import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { site } from "@/lib/site";
import { IconArrow, IconInstagram, IconTelegram } from "./Icons";
import { Monogram } from "./Monogram";

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-club">
          <div>
            <p className="eyebrow">Закрите комʼюніті</p>
            <p className="ftr-club-title">Ціни, яких немає в Instagram</p>
            <p className="ftr-club-text">
              Розпродажі, Black Friday та пропозиції «лише 1 день» ми публікуємо тільки в нашому Telegram-каналі.
            </p>
          </div>
          <a className="btn btn-light" href={site.telegramChannelUrl} target="_blank" rel="noopener noreferrer">
            <IconTelegram /> Приєднатися до каналу
          </a>
        </div>

        <div className="ftr-grid">
          <div className="ftr-brand">
            <Monogram className="ftr-mono" />
            <p>
              {site.tagline}.
              <br />
              Власне виробництво з {site.since} року.
            </p>
          </div>
          <nav className="ftr-col" aria-label="Каталог">
            <p className="eyebrow">Каталог</p>
            <Link href="/catalog?c=new">Новинки</Link>
            {CATEGORIES.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/catalog?c=${c.id}`}>
                {c.name}
              </Link>
            ))}
          </nav>
          <nav className="ftr-col" aria-label="Покупцям">
            <p className="eyebrow">Покупцям</p>
            <Link href="/info/how-to-order">Як замовити</Link>
            <Link href="/info/delivery">Доставка та оплата</Link>
            <Link href="/info/returns">Обмін і повернення</Link>
            <Link href="/info/sizes">Таблиця розмірів</Link>
            <Link href="/about">Про бренд</Link>
            <Link href="/info/contacts">Контакти</Link>
          </nav>
          <div className="ftr-col">
            <p className="eyebrow">На звʼязку</p>
            <a href={site.managerUrl} target="_blank" rel="noopener noreferrer">
              <IconTelegram /> Менеджер @{site.manager}
            </a>
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
              <IconInstagram /> @{site.instagram} · {site.instagramFollowers}
            </a>
            <a href={site.wholesaleUrl} target="_blank" rel="noopener noreferrer">
              <IconArrow /> Опт і співпраця
            </a>
          </div>
        </div>
      </div>

      <div className="ftr-mast" aria-hidden>
        STRONG
      </div>

      <div className="wrap ftr-legal">
        <span>© {new Date().getFullYear()} STRONG. Усі права захищені.</span>
        <span>Made in Ukraine</span>
      </div>
    </footer>
  );
}
