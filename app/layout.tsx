import "./globals.css";
import "./feature-a.css";
import "./feature-b.css";
import "./feature-d.css";
import { SellerDemoEntry } from "@/components/SellerDemoEntry";
import { CartProvider } from "@/components/CartProvider";

export const metadata = {
  title: "KORAIL+ | 나의 티켓",
  description: "KORAIL+ 이동 경험 확장 MVP",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body><CartProvider>{children}</CartProvider><SellerDemoEntry /></body>
    </html>
  );
}
