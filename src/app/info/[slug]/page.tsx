import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INFO } from "@/lib/info";
import { site } from "@/lib/site";
import { IconInstagram, IconTelegram } from "@/components/Icons";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return Object.keys(INFO).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = INFO[(await params).slug];
  return page ? { title: page.title, description: page.lead } : {};
}

export default async function InfoPage({ params }: { params: Params }) {
  const slug = (await params).slug;
  const page = INFO[slug];
  if (!page) notFound();

  return (
    <div className="wrap page info">
      <nav className="info-nav" aria-label="Покупцям">
        {Object.entries(INFO).map(([s, p]) => (
          <Link key={s} href={`/info/${s}`} className={s === slug ? "is-on" : ""} aria-current={s === slug ? "page" : undefined}>
            {p.title}
          </Link>
        ))}
      </nav>
      <article className="info-body">
        <header className="page-head">
          <p className="eyebrow">Покупцям</p>
          <h1 className="display display-xl">{page.title}</h1>
          <p className="info-lead">{page.lead}</p>
        </header>
        {page.blocks.map((b) => (
          <section key={b.h} className="info-block">
            <h2>{b.h}</h2>
            {b.p.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </section>
        ))}
        {page.table && (
          <section className="info-block">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    {page.table.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.table.rows.map((r) => (
                    <tr key={r[0]}>
                      {r.map((c, i) => (i === 0 ? <th key={i}>{c}</th> : <td key={i}>{c}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted small">{page.table.note}</p>
          </section>
        )}
        <div className="info-ctas">
          <a href={site.managerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            <IconTelegram /> @{site.manager}
          </a>
          {slug === "contacts" && (
            <>
              <a href={site.telegramChannelUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                <IconTelegram /> Канал зі знижками
              </a>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                <IconInstagram /> Instagram
              </a>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
