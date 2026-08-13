import { SearchPage } from "@/components/ShopScreens";
import { Suspense } from "react";
export default function Page() { return <Suspense fallback={<main className="shop-shell" />}><SearchPage /></Suspense>; }
