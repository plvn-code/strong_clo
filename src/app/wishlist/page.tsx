import type { Metadata } from "next";
import { WishlistGrid } from "./WishlistGrid";
import { PRODUCTS, toCard } from "@/lib/catalog";

export const metadata: Metadata = { title: "Обране" };

export default function WishlistPage() {
  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">STRONG</p>
        <h1 className="display display-xl">Обране</h1>
      </header>
      <WishlistGrid cards={PRODUCTS.map((p) => toCard(p))} />
    </div>
  );
}
