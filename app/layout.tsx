import "./globals.css";
import "./feature-a.css";
import "./feature-b.css";
import "./shipping.css";
import { SellerDemoEntry } from "@/components/SellerDemoEntry";

export const metadata = {
  title: "KORAIL+ | 나의 티켓",
  description: "KORAIL+ 이동 경험 확장 MVP",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}<SellerDemoEntry /></body>
    </html>
  );
}
