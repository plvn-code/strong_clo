"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { img } from "@/lib/catalog";
import { formatPrice, plural } from "@/lib/format";
import { site } from "@/lib/site";
import { useStore, type PlacedOrder } from "@/lib/store";
import { IconCheck, IconTelegram } from "@/components/Icons";

const DELIVERY = [
  { id: "Нова пошта — відділення", label: "Відділення", hint: "№ відділення" },
  { id: "Нова пошта — поштомат", label: "Поштомат", hint: "№ поштомата" },
  { id: "Нова пошта — курʼєр", label: "Курʼєр", hint: "Вулиця, будинок, квартира" },
];
const CONTACT = ["Telegram", "Viber", "Дзвінок"];

export function CheckoutForm() {
  const { bag, total, count, ready, contact, saveContact, clearBag, setLastOrder } = useStore();
  const [f, setF] = useState({ name: "", phone: "+380 ", telegram: "", city: "", branch: "", comment: "", website: "" });
  const [delivery, setDelivery] = useState(DELIVERY[0].id);
  const [via, setVia] = useState(CONTACT[0]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    if (contact) setF((v) => ({ ...v, ...contact }));
  }, [contact]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((v) => ({ ...v, [k]: e.target.value }));
  const hint = DELIVERY.find((d) => d.id === delivery)!.hint;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: f.name, phone: f.phone, telegram: f.telegram, city: f.city, branch: f.branch, comment: f.comment },
          delivery,
          contact: via,
          website: f.website,
          lines: bag.map((l) => ({ slug: l.slug, colour: l.colour, size: l.size, qty: l.qty })),
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; id?: string; total?: number; count?: number; error?: string } | null;
      if (!res.ok || !data?.ok || !data.id) throw new Error(data?.error || "Не вдалося надіслати замовлення. Спробуйте ще раз.");
      const order = { id: data.id, date: new Date().toISOString(), total: data.total ?? total, count: data.count ?? count };
      saveContact({ name: f.name, phone: f.phone, telegram: f.telegram, city: f.city, branch: f.branch });
      setLastOrder(order);
      clearBag();
      setDone(order);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка мережі");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="thanks wrap">
        <span className="thanks-ico">
          <IconCheck />
        </span>
        <p className="eyebrow">Замовлення {done.id}</p>
        <h1 className="display display-xl">Дякуємо!</h1>
        <p className="thanks-text">
          Ми отримали ваше замовлення на {formatPrice(done.total)}. Менеджер напише вам {via === "Дзвінок" ? "або зателефонує" : `у ${via}`} найближчим
          часом, підтвердить наявність і надішле реквізити для оплати.
        </p>
        <ol className="thanks-steps">
          <li>
            <span>01</span>Замовлення отримано
          </li>
          <li>
            <span>02</span>Реквізити від менеджера @{site.manager}
          </li>
          <li>
            <span>03</span>Відправка Новою поштою + ТТН
          </li>
        </ol>
        <div className="thanks-ctas">
          <a href={site.managerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            <IconTelegram /> Написати менеджеру
          </a>
          <Link href="/catalog" className="btn btn-line">
            Продовжити покупки
          </Link>
        </div>
      </div>
    );
  }

  if (ready && bag.length === 0) {
    return (
      <div className="empty wrap">
        <p className="display-s">Кошик порожній</p>
        <p className="muted">Додайте речі, щоб оформити замовлення.</p>
        <Link href="/catalog" className="btn btn-dark">
          До каталогу
        </Link>
      </div>
    );
  }

  return (
    <form className="co wrap" onSubmit={submit}>
      <div className="co-main">
        <header className="co-head">
          <p className="eyebrow">Оформлення</p>
          <h1 className="display display-xl">Замовлення</h1>
        </header>

        <div className="co-note">
          <IconTelegram />
          <p>
            Оплата — за реквізитами. Після оформлення менеджер <b>@{site.manager}</b> напише вам, підтвердить наявність і надішле реквізити.
          </p>
        </div>

        <fieldset className="co-block">
          <legend>
            <span>01</span> Контакти
          </legend>
          <label className="field">
            <span>Імʼя та прізвище</span>
            <input required minLength={2} autoComplete="name" value={f.name} onChange={set("name")} placeholder="Олена Коваль" />
          </label>
          <label className="field">
            <span>Телефон</span>
            <input required type="tel" inputMode="tel" autoComplete="tel" pattern="[\d\s\+\(\)\-]{10,20}" value={f.phone} onChange={set("phone")} />
          </label>
          <label className="field">
            <span>Telegram — нік або номер</span>
            <input autoComplete="off" value={f.telegram} onChange={set("telegram")} placeholder="@username" />
            <small>Так менеджер швидше надішле реквізити</small>
          </label>
          <div className="field">
            <span>Як із вами звʼязатися</span>
            <div className="seg" role="radiogroup" aria-label="Спосіб звʼязку">
              {CONTACT.map((c) => (
                <button type="button" key={c} role="radio" aria-checked={via === c} className={via === c ? "is-on" : ""} onClick={() => setVia(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="co-block">
          <legend>
            <span>02</span> Доставка · Нова пошта
          </legend>
          <div className="seg" role="radiogroup" aria-label="Спосіб доставки">
            {DELIVERY.map((d) => (
              <button type="button" key={d.id} role="radio" aria-checked={delivery === d.id} className={delivery === d.id ? "is-on" : ""} onClick={() => setDelivery(d.id)}>
                {d.label}
              </button>
            ))}
          </div>
          <label className="field">
            <span>Місто</span>
            <input required minLength={2} autoComplete="address-level2" value={f.city} onChange={set("city")} placeholder="Київ" />
          </label>
          <label className="field">
            <span>{hint}</span>
            <input required value={f.branch} onChange={set("branch")} placeholder={delivery.includes("курʼєр") ? "вул. Хрещатик, 1, кв. 1" : "№ 1"} />
          </label>
          <label className="field">
            <span>Коментар (необовʼязково)</span>
            <textarea rows={3} value={f.comment} onChange={set("comment")} placeholder="Зріст, побажання щодо посадки, час для дзвінка…" maxLength={600} />
          </label>
          <label className="hp" aria-hidden>
            Website
            <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
          </label>
        </fieldset>
      </div>

      <aside className="co-side">
        <div className="co-sum">
          <p className="eyebrow">
            Ваше замовлення · {count} {plural(count, "річ", "речі", "речей")}
          </p>
          <ul className="co-lines">
            {bag.map((l) => (
              <li key={l.key}>
                <div className="co-img">
                  <Image src={img(l.photo)} alt="" fill sizes="72px" />
                  <i>{l.qty}</i>
                </div>
                <div>
                  <p className="co-name">{l.name}</p>
                  <p className="muted small">
                    {l.colour} · {l.size}
                  </p>
                </div>
                <span>{formatPrice(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="sum-row">
            <span>Товари</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="sum-row">
            <span>Доставка</span>
            <span>за тарифами НП</span>
          </div>
          <div className="sum-row is-total">
            <span>До сплати</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-dark btn-block" disabled={sending || !ready}>
            {sending ? "Надсилаємо…" : "Підтвердити замовлення"}
          </button>
          <p className="muted small">Натискаючи кнопку, ви погоджуєтесь, що менеджер звʼяжеться з вами для підтвердження та оплати.</p>
        </div>
      </aside>
    </form>
  );
}
