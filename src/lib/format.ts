export const PRICE_ON_REQUEST = "Ціна за запитом";

export function formatPrice(value: number | null) {
  if (value === null) return PRICE_ON_REQUEST;
  return `${new Intl.NumberFormat("uk-UA").format(value).replace(/\s/g, " ")} ₴`;
}

/** 1 товар / 2 товари / 5 товарів */
export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
