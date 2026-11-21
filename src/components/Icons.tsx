type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconBag = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base}>
    <path d="M5 8h14l-1 12.5H6L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);
export const IconHeart = ({ className, filled }: P & { filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />
  </svg>
);
export const IconSearch = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);
export const IconClose = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base}>
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
  </svg>
);
export const IconArrow = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base}>
    <path d="M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5" />
  </svg>
);
export const IconPlus = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconMinus = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base}>
    <path d="M5 12h14" />
  </svg>
);
export const IconTelegram = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
    <path d="M20.7 4.3 2.9 11.2c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 1.8 5.4c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14.1c.3-1.3-.5-1.8-1.5-1.4ZM9 14.6l9.3-5.9c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.3L9 14.6Z" />
  </svg>
);
export const IconInstagram = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" stroke="none" />
  </svg>
);
export const IconCheck = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden {...base}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
