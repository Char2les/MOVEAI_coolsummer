const svgDataUrl = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const storefront = (label: string, color: string, accent: string) => svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420"><rect width="640" height="420" fill="${color}"/><rect y="235" width="640" height="185" fill="#f6efe7"/><rect x="76" y="104" width="488" height="185" rx="12" fill="#fff9ed"/><path d="M52 112h536l-34-68H86z" fill="${accent}"/><rect x="119" y="168" width="150" height="121" rx="5" fill="#6a5046"/><rect x="356" y="160" width="133" height="129" rx="5" fill="#afc9d8"/><path d="M422 160v129M356 224h133" stroke="#fff" stroke-width="8"/><text x="320" y="89" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="#fff">${label}</text><circle cx="76" cy="346" r="27" fill="#334155"/><circle cx="550" cy="346" r="27" fill="#334155"/></svg>`);

export const merchantImageSrc: Record<string, string> = {
  samjin: storefront("FISH CAKE", "#9a6246", "#d9a466"),
  leeheung: storefront("BAKERY", "#775d3e", "#d9af70"),
  giftshop: storefront("BUSAN GIFT", "#b18b68", "#607da5"),
  haeundae: storefront("LOCAL FOOD", "#9a7657", "#d5a45d"),
  busanbrew: storefront("BUSAN BREW", "#5c6e5a", "#d6b96d"),
  market: storefront("LOCAL MARKET", "#657d9a", "#e4a56f"),
  seaside: storefront("SEA SIDE", "#4e7992", "#f1c979"),
  stationery: storefront("STATIONERY", "#8a6d96", "#d6a2be"),
};

export const productImageSrc = (name: string, hue = "#216beb") => svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f7fbff"/><stop offset="1" stop-color="${hue}"/></linearGradient></defs><rect width="240" height="180" rx="18" fill="url(#g)"/><path d="M65 65h110v76H65z" fill="#fff8e9" stroke="#4a5b70" stroke-width="5"/><path d="M58 67h124L166 42H74z" fill="#f0c77c" stroke="#4a5b70" stroke-width="5"/><path d="M113 42v99" stroke="#e66b67" stroke-width="13"/><text x="120" y="160" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#1f3148">${name}</text></svg>`);
