import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalog";
import { site } from "@/lib/site";
import { INFO } from "@/lib/info";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/catalog", "/about"].map((p) => ({ url: `${site.url}${p}` }));
  return [
    ...pages,
    ...Object.keys(INFO).map((s) => ({ url: `${site.url}/info/${s}` })),
    ...PRODUCTS.map((p) => ({ url: `${site.url}/product/${p.slug}` })),
  ];
}
