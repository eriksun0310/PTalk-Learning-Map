import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Sans_TC } from "next/font/google";
import { apps } from "@/lib/apps";
import { SITE_NAME, SITE_URL } from "@/lib/site";
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

const jpCount = apps.filter((a) => a.language === "jp").length;
const enCount = apps.filter((a) => a.language === "en").length;
const supportCount = apps.filter((a) => a.language === "none").length;
const DESCRIPTION = `PTalk 是台灣團隊開發的語言學習 App 系列，共 ${apps.length} 款：日文 ${jpCount} 款（零基礎到 N1）、英文多益 ${enCount} 款、學習輔助 ${supportCount} 款。回答一個問題，告訴你現在該下載哪一款。`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PTalk 學習地圖｜日文與多益學習 App 推薦",
    template: `%s｜${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: SITE_NAME,
    title: "PTalk 學習地圖｜日文與多益學習 App 推薦",
    description: DESCRIPTION,
    url: "/",
    images: ["/og/default.png"],
  },
  twitter: { card: "summary_large_image", images: ["/og/default.png"] },
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
