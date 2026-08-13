import "./globals.css";
import "./feature-a.css";
import "./feature-b.css";
import "./shipping.css";
import "./feedback-polish.css";
import "./korail-home.css";
import "./feature-d.css";

import { SellerDemoEntry } from "@/components/SellerDemoEntry";
import { DemoUserSelector } from "@/components/DemoUserSelector";
import { HomeEntry } from "@/components/HomeEntry";
import { CartProvider } from "@/components/CartProvider";
import { DataCatalogProvider } from "@/components/DataCatalogProvider";

export const metadata = {
  title: "KORAIL+ | 나의 티켓",
  description: "KORAIL+ 이동 경험 확장 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <DataCatalogProvider><CartProvider>{children}</CartProvider></DataCatalogProvider>
        <HomeEntry />
        <DemoUserSelector />
        <SellerDemoEntry />
      </body>
    </html>
  );
}
