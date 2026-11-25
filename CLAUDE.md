# STRONG — online store (client project)

Store for **STRONG** — «український бренд одягу» (Instagram @strong_clo, 103K; власне виробництво з 2021 року). Closed Telegram channel «STRONG» (t.me/+O2sitA6xOcNiMTZi, ~9.3K, sales/Black Friday only there), wholesale t.me/strongoptt + IG @strong_clo.cooperation. Manager for orders: **@strong_anna**. The owner of this repo is a developer (studio Superio) building the site for the client.

Brief (2026-11-21): expensive, premium, modern, **Vogue style**, colours of the brand (client palette: **#000000 / #FFFFFF / #261B14** cocoa), layout feel of kulakovsky.ua, typography like onebyone.ua; **mobile first — must be perfect on phones**, desktop too. Product photos from the Telegram channel. **No online payment**: customer places an order → it goes to the managers' Telegram bot → the manager sends payment details.

**Talk to the user in Russian.** Site copy is **Ukrainian**. Read `docs/STATUS.md` first.

## Commands
```bash
npm run build && npx next start -p 3028     # production preview
npm run dev -- -p 3029                      # dev
kill $(lsof -ti tcp:3028 -sTCP:LISTEN)      # restart only our port
npm run lint && npx tsc --noEmit            # must stay clean
open -a "Google Chrome" http://localhost:3028
~/Desktop/nudes/research/.venv/bin/python -I scripts/build_pod.py <raw_dir>   # rebuild public/images from <raw_dir>/<msg id>.jpg (HEIC → `sips -s format jpeg`); removes unreferenced images
```
`node_modules` is a symlink to `~/Desktop/nudes/node_modules` (same package.json) — the user's disk is tight. Raw TG photos are deleted after building.

## Getting photos from Telegram
Manager's files: chat with @podgaynyy11 in the account @pay_devv (`web.telegram.org/k/?account=2`), documents → `upload.getFile` with `inputDocumentFileLocation`; JPEGs were downscaled to 2048 px in the browser (OffscreenCanvas), HEIC taken raw and converted with `sips`.
The channel is private; the user is a member and logged into Telegram Web in Chrome (Playwright drives it). In web.telegram.org/k the global `rootScope.managers.apiManager.invokeApi('messages.getHistory' | 'upload.getFile', …)` works (peer id −1958482995). Photos have sizes m/x/y(960×1280)/w(1920×2560). Downloads via `<a download>` are unreliable — return base64 chunks from `browser_evaluate` with `filename` and decode (see git history / scripts/unpack.py). `research/tg-all.json` = every message (text, grouped_id, photo sizes); `research/posts.txt` = readable dump.

## Stack
Next.js 15 App Router · React 19 · TypeScript strict · plain CSS (`src/app/globals.css`, tokens in `:root`) · **Manrope** (onebyone.ua uses TT Norms Pro + Manrope; TT Norms is commercial) — light 200 masthead «STRONG» sized `calc((100vw - 2*var(--g)) / 3.78)` to fill the line, uppercase tracked labels, no serif/italic text · no UI libraries.

**Logo:** «SS» monogram traced from the client's file (`research/logo-original.jpg`) → `src/components/Monogram.tsx` (currentColor), `public/brand/monogram.svg`, `src/app/icon.svg`, `apple-icon.png`, `opengraph-image.jpg`.

## Data
- `src/data/products.ts` — **34 products = the assortment the store manager Юра (@podgaynyy11) sent on 2026-11-25** to the user's Telegram account @pay_devv (dump: `research/pod-messages.json`). Names, `price` / `oldPrice` («X грн замість Y»), colours, sizes and description bullets only from his messages; `price: null` = he gave no price → «Ціна за запитом» + «Дізнатися ціну» (Telegram link), the orders API refuses such lines. Photos = his original files (HEIC/JPEG) → message id → `public/images/p/<id>.webp`; ids < 3000 are older channel photos (only the black body). `source` = message id with the description.
- `src/lib/catalog.ts` — category tree from the client (2026-11-22): Верхній одяг → `puffers` (пуховики/куртки) + `vests`; Спортивні костюми (`suits`) → `suits-demi` + `suits-winter`; `shirts`, `tees`, `longs`, `knit`, `thermo` (Термоодяг, added by the manager), `pants`; `vests` is «Жилетки / піджаки». Group ids (`outerwear`, `suits`) show all children; `Product.also` puts a model into extra categories. Colour families, `query()`, `toCard()`. `edImg()` = editorial 1440×1920 frames in `public/images/ed/`.
- `src/lib/info.ts` — info pages (how-to-order, delivery, returns, sizes, contacts). `src/lib/site.ts` — brand links.

## Routes
`/` (hero: the manager's 3 campaign shots 3641–3643 — phones slide through them, desktop shows them as a fixed triptych — + masthead, manifesto, new-in rail, categories, cocoa editorial, bestsellers, puffer lookbook, details/facts, other rail, 3 steps, insta grid) · `/catalog` (?c= category|new|bestsellers, ?color=, ?size=, ?sort=, ?q=; filter sheet; 1/2 columns on phones) · `/product/[slug]` (?colour=; swipe gallery + zoom, sticky buy bar) · `/cart` · `/checkout` → `api/orders` · `/wishlist` · `/about` · `/info/[slug]`.

## Orders
`/api/orders` validates against the catalogue (prices recomputed server-side), rate-limits, honeypot, sends HTML message to `TELEGRAM_CHAT_ID` via `TELEGRAM_BOT_TOKEN` with a «Написати @user» button. Without env: dev → logged; **production → 503 asking to write @strong_anna** (so no order is silently lost).

## Rules
- Never invent product facts. Sources: `research/pod-messages.json` (manager, current) and `research/tg-all.json` (channel).
- Never put state-driven classes on a `[data-reveal]` element — Reveal sets `data-in`.
- Playwright: inject `*{transition:none!important;animation:none!important}` and scroll the page before full-page screenshots (lazy images).
- next/image `qualities` are [75, 85, 90].
- Check 390 px and 1440 px after visible changes.
