"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { merchants, type Merchant } from "@/lib/merchants";
import { products, stores, type Product, type Store } from "@/lib/commerce";

type Catalog = { merchants: Merchant[]; products: Product[]; stores: Store[] };
const fallback: Catalog = { merchants, products, stores };
const CatalogContext = createContext<Catalog>(fallback);

export function DataCatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(fallback);
  useEffect(() => {
    let active = true;
    fetch("/api/catalog", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<Catalog> : Promise.reject(new Error("Catalog request failed.")))
      .then((data) => { if (active) setCatalog(data); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  const value = useMemo(() => catalog, [catalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export const useDataCatalog = () => useContext(CatalogContext);
