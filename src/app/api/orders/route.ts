import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";
import { tgConfigured, notifyManagers } from "@/lib/telegram";
import { formatPrice } from "@/lib/format";

/**
 * Order intake → managers' Telegram (bot TELEGRAM_BOT_TOKEN → chat TELEGRAM_CHAT_ID).
 * The site does not take payments: the manager writes to the customer and sends payment details.
 * Prices are recomputed from the catalogue — the client's numbers are never trusted.
 */

const DELIVERY = ["Нова пошта — відділення", "Нова пошта — поштомат", "Нова пошта — курʼєр"];
const CONTACT = ["Telegram", "Viber", "Дзвінок"];

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 6;
}

const str = (v: unknown, n = 120) => String(v ?? "").trim().slice(0, n);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Забагато спроб. Спробуйте за кілька хвилин." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  // honeypot — bots fill every field
  if (str(body.website)) return NextResponse.json({ ok: true, id: "ST-0" });

  const c = (body.customer ?? {}) as Record<string, unknown>;
  const name = str(c.name, 80);
  const phone = str(c.phone, 24);
  const phoneDigits = phone.replace(/\D/g, "");
  const telegram = str(c.telegram, 40).replace(/^@/, "").replace(/^https?:\/\/t\.me\//, "");
  const city = str(c.city, 80);
  const branch = str(c.branch, 160);
  const comment = str(c.comment, 600);
  const delivery = DELIVERY.includes(str(body.delivery)) ? str(body.delivery) : null;
  const contact = CONTACT.includes(str(body.contact)) ? str(body.contact) : "Telegram";

  const raw = Array.isArray(body.lines) ? body.lines.slice(0, 30) : [];
  const lines = raw
    .map((l: Record<string, unknown>) => {
      const p = getProduct(str(l.slug, 80));
      if (!p) return null;
      const colour = p.colours.find((x) => x.name === str(l.colour, 40));
      const size = p.sizes.find((s) => s === str(l.size, 20));
      if (!colour || !size) return null;
      const qty = Math.min(9, Math.max(1, Math.floor(Number(l.qty)) || 1));
      return { p, colour: colour.name, size, qty, sum: p.price * qty };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const errors: string[] = [];
  if (name.length < 2) errors.push("імʼя");
  if (phoneDigits.length < 10 || phoneDigits.length > 13) errors.push("телефон");
  if (telegram && !/^[A-Za-z0-9_]{4,32}$/.test(telegram) && !/^\+?\d{10,13}$/.test(telegram)) errors.push("Telegram");
  if (!delivery || city.length < 2 || branch.length < 1) errors.push("доставка");
  if (lines.length === 0) errors.push("товари");
  if (errors.length) return NextResponse.json({ ok: false, error: `Перевірте: ${errors.join(", ")}` }, { status: 422 });

  if (!tgConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "Прийом замовлень через сайт ще налаштовується. Напишіть, будь ласка, менеджеру @strong_anna в Telegram." },
      { status: 503 },
    );
  }

  const id = `ST-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const total = lines.reduce((s, l) => s + l.sum, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const tgUser = /^[A-Za-z0-9_]{4,32}$/.test(telegram) ? telegram : "";

  const text = [
    `🖤 <b>Нове замовлення ${id}</b>`,
    "",
    ...lines.map((l) => `• <b>${esc(l.p.name)}</b>\n   ${esc(l.colour)} · ${esc(l.size)} · ${l.qty} шт — ${formatPrice(l.sum)}`),
    "",
    `<b>Разом: ${formatPrice(total)}</b> (${count} шт)`,
    "",
    `👤 ${esc(name)}`,
    `📞 ${esc(phone)}`,
    telegram ? `✈️ Telegram: ${tgUser ? "@" + esc(tgUser) : esc(telegram)}` : "✈️ Telegram: не вказано",
    `💬 Звʼязок: ${contact}`,
    `📦 ${delivery} — ${esc(city)}, ${esc(branch)}`,
    comment ? `📝 ${esc(comment)}` : "",
    "",
    "Надішліть клієнтці реквізити для оплати.",
  ]
    .filter((x) => x !== null)
    .join("\n");

  try {
    await notifyManagers(text, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(tgUser ? { reply_markup: { inline_keyboard: [[{ text: `Написати @${tgUser}`, url: `https://t.me/${tgUser}` }]] } } : {}),
    });
  } catch (e) {
    console.error("[orders] telegram failed", e);
    return NextResponse.json({ ok: false, error: "Не вдалося надіслати замовлення. Спробуйте ще раз або напишіть @strong_anna." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, id, total, count });
}
