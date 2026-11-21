"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/** Reveals every [data-reveal] element once it enters the viewport (sets data-in). */
export function Reveal() {
  const pathname = usePathname();
  const params = useSearchParams();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => (el.dataset.in = "1"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "1";
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname, params]);
  return null;
}
