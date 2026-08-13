import { Suspense } from "react";
import { ShippingStartContent } from "./shipping-start-content";
export default function ShippingStartPage() { return <Suspense fallback={null}><ShippingStartContent /></Suspense>; }
