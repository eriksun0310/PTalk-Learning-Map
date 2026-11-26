import { androidUrl, iosUrl, isReleased } from "@/data/stores";
import { levelLabel, type AppData } from "@/lib/apps";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** 支援平台的文字描述（全由 data/stores.ts 推導，和頁面按鈕一致） */
export function platformText(id: string): string {
  if (!isReleased(id)) return "即將上架";
  const ios = iosUrl(id);
  const android = androidUrl(id);
  if (ios && android) return "iPhone、Android";
  if (android) return "Android（iPhone 版審核中）";
  if (ios) return "僅 iPhone";
  return "即將上架";
}

/** App 頁 meta description：名稱、語言與等級、一句話、平台 */
export function appDescription(app: AppData): string {
  return `${app.name}是 PTalk 的學習 App（${levelLabel(app)}）：${app.tagline}。支援平台：${platformText(app.id)}。`;
}

const publisher = { "@type": "Organization", name: "PTalk", url: SITE_URL };

/** 首頁：Organization + WebSite（只放真實存在的資訊） */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: "PTalk",
        url: SITE_URL,
        email: "connect.ptalk@gmail.com",
        sameAs: ["https://www.threads.com/@ptalk.design"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#site`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "zh-Hant",
        publisher: { "@id": `${SITE_URL}/#org` },
      },
    ],
  };
}

/** App 頁：MobileApplication + BreadcrumbList；不放評分、評論與價格 */
export function appJsonLd(app: AppData) {
  const released = isReleased(app.id);
  const os = [iosUrl(app.id) && "iOS", androidUrl(app.id) && "Android"].filter(Boolean).join(", ");
  const url = `${SITE_URL}/apps/${app.id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MobileApplication",
        name: app.name,
        description: app.tagline,
        url,
        image: `${SITE_URL}/icons/${app.id}.png`,
        applicationCategory: "EducationalApplication",
        inLanguage: "zh-Hant",
        publisher,
        ...(released && os ? { operatingSystem: os } : {}),
        ...(released && (iosUrl(app.id) ?? androidUrl(app.id))
          ? { downloadUrl: iosUrl(app.id) ?? androidUrl(app.id) }
          : {}),
        ...(app.updated ? { dateModified: app.updated } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: app.name, item: url },
        ],
      },
    ],
  };
}
