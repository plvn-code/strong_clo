# STRONG — status

## Done (2026-11-21)
- Next.js store on :3028 — white / black / cocoa #261B14, Vogue style, mobile first; Manrope typography (onebyone.ua feel).
- Logo «SS» vectorised from the client's file: header, menu, footer, favicon, apple-icon, OG image.
- 33 products from the private Telegram channel «STRONG» with regular prices, colours, sizes and facts from the captions; 200 product photos (960×1280 WebP) + 28 editorial frames (1440×1920).
- Home, catalogue with filters, product page (swipe gallery, zoom, colours, sizes, sticky buy bar, accordions), bag drawer, cart, checkout, thank-you, wishlist, about, info pages, 404.
- Orders → Telegram bot (`/api/orders`), payment details are sent by the manager.

## Next
- **Telegram bot:** create a bot in @BotFather, add it to the managers' chat (or the manager starts it), set `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (.env.local / Vercel env).
- GitHub repo + Vercel — ask the user.
- Domain, then `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_ALLOW_INDEXING=true`.

## Open questions for the client
1. Prices: we show the **regular** prices from the channel posts (some are from 2024–2025) — confirm the current price list.
2. Which models are in stock now (the summer items and older suits may be sold out) and which new ones to add.
3. Sizes not stated in posts (`sizesConfirmed: false` in products.ts): lacquer/wrap/burgundy puffers, vests, jackets, velour & unlined ZIP suits, dresses, skirts, linen set.
4. Size chart in cm — current table is approximate.
5. Return/exchange wording (we wrote 14 days, sale items — inspection at the post office only).
6. Delivery cost policy (free from some amount?), prepayment rules.
7. Original studio photos if they have them (TG originals are already 1920×2560 — good).
8. Telegram bot token + chat id for orders.
