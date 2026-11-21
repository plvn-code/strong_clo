/**
 * Minimal Telegram Bot API client (server only) — order notifications to the managers' chat.
 * TELEGRAM_BOT_TOKEN — bot token from @BotFather; TELEGRAM_CHAT_ID — managers' chat/group.
 * Without a token every call is only logged (demo mode), so the site works before it is set up.
 */
export const tgConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

export async function tg<T = unknown>(method: string, payload: Record<string, unknown>): Promise<T | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log(`[telegram:demo] ${method}`, JSON.stringify(payload).slice(0, 1200));
    return null;
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean; result?: T; description?: string } | null;
  if (!data?.ok) throw new Error(`telegram ${method}: ${data?.description ?? res.status}`);
  return data.result ?? null;
}

/** Message to the managers' chat. */
export function notifyManagers(text: string, extra: Record<string, unknown> = {}) {
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!chat || !process.env.TELEGRAM_BOT_TOKEN) {
    console.log("[managers:demo]\n" + text);
    return Promise.resolve(null);
  }
  return tg("sendMessage", { chat_id: chat, text, ...extra });
}

export const clip = (v: unknown, n = 200) => String(v ?? "").slice(0, n).replace(/[<>]/g, "");
