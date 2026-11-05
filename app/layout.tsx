import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_TC({
  variable: "--font-noto",
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: false,
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PTalk 學習地圖｜現在的你，該下載哪一款？",
    template: "%s｜PTalk 學習地圖",
  },
  description:
    "回答 3 個問題，直接告訴你最適合的一款。PTalk 共 8 款語言學習 App：日文 6 款、英文（多益）2 款，每一款都可以免費下載。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${noto.variable} ${plex.variable}`}>
      <body className="flex min-h-screen flex-col font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
