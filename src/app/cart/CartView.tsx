"use client";

import Link from "next/link";
import { BagLines } from "@/components/BagDrawer";
import { formatPrice, plural } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CartView() {
  const { bag, total, count, ready } = useStore();
  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">{ready && count > 0 ? `${count} ${plural(count, "річ", "речі", "речей")}` : "STRONG"}</p>
        <h1 className="display display-xl">Кошик</h1>
      </header>
      {ready && bag.length === 0 ? (
        <div className="empty">
          <p className="display-s">Тут поки порожньо</p>
          <p className="muted">Зазирніть у новинки — пуховики й костюми сезону AW 26/27.</p>
          <Link href="/catalog?c=new" className="btn btn-dark">
            Новинки
          </Link>
        </div>
      ) : (
        <div className="cart">
          <BagLines />
          <aside className="cart-side">
            <div className="sum-row is-total">
              <span>Разом</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="muted small">Доставка Новою поштою за тарифами перевізника. Реквізити для оплати надішле менеджер у Telegram.</p>
            <Link href="/checkout" className="btn btn-dark btn-block">
              Оформити замовлення
            </Link>
            <Link href="/catalog" className="btn btn-line btn-block">
              Продовжити покупки
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
