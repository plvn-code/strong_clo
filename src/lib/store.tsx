"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Client-side store: bag, wishlist, remembered contact details and the last order (localStorage).
 * Orders themselves go to the managers' Telegram via /api/orders; payment details are sent
 * by the manager — there is no online payment on the site.
 */

export interface BagLine {
  key: string;
  slug: string;
  name: string;
  colour: string;
  size: string;
  photo: number;
  price: number;
  qty: number;
}

export interface Contact {
  name: string;
  phone: string;
  telegram: string;
  city: string;
  branch: string;
}

export interface PlacedOrder {
  id: string;
  date: string;
  total: number;
  count: number;
}

interface StoreValue {
  ready: boolean;
  bag: BagLine[];
  count: number;
  total: number;
  bagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  add: (line: Omit<BagLine, "key" | "qty">, open?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clearBag: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  contact: Contact | null;
  saveContact: (c: Contact) => void;
  lastOrder: PlacedOrder | null;
  setLastOrder: (o: PlacedOrder) => void;
}

const K = { bag: "strong.bag.v1", wish: "strong.wish.v1", contact: "strong.contact.v1", last: "strong.last.v1" };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — keep in memory */
  }
}

const Ctx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bag, setBag] = useState<BagLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    setBag(read(K.bag, []));
    setWishlist(read(K.wish, []));
    setContact(read(K.contact, null));
    setLastOrder(read(K.last, null));
    setReady(true);
  }, []);

  useEffect(() => void (ready && write(K.bag, bag)), [bag, ready]);
  useEffect(() => void (ready && write(K.wish, wishlist)), [wishlist, ready]);
  useEffect(() => void (ready && write(K.contact, contact)), [contact, ready]);
  useEffect(() => void (ready && write(K.last, lastOrder)), [lastOrder, ready]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", bagOpen);
  }, [bagOpen]);

  const add = useCallback<StoreValue["add"]>((line, open = true) => {
    const key = `${line.slug}|${line.colour}|${line.size}`;
    setBag((prev) => {
      const hit = prev.find((l) => l.key === key);
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + 1) } : l));
      return [...prev, { ...line, key, qty: 1 }];
    });
    if (open) setBagOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setBag((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, qty) } : l)),
    );
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      bag,
      count: bag.reduce((s, l) => s + l.qty, 0),
      total: bag.reduce((s, l) => s + l.qty * l.price, 0),
      bagOpen,
      openBag: () => setBagOpen(true),
      closeBag: () => setBagOpen(false),
      add,
      setQty,
      remove: (key) => setBag((prev) => prev.filter((l) => l.key !== key)),
      clearBag: () => setBag([]),
      wishlist,
      toggleWish: (slug) => setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
      contact,
      saveContact: setContact,
      lastOrder,
      setLastOrder,
    }),
    [ready, bag, bagOpen, add, setQty, wishlist, contact, lastOrder],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
