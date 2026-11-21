import Link from "next/link";
import { Monogram } from "@/components/Monogram";

export default function NotFound() {
  return (
    <div className="nf wrap">
      <Monogram className="nf-mono" />
      <p className="eyebrow">404</p>
      <h1 className="display display-xl">Сторінку не знайдено</h1>
      <p className="muted">Можливо, модель уже розпродана або посилання змінилося.</p>
      <Link href="/catalog" className="btn btn-dark">
        До каталогу
      </Link>
    </div>
  );
}
