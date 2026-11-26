# PTalk 學習地圖官網 — GEO / SEO 健檢報告

> 健檢日期：2026-11-26　｜　範圍：`/Users/jiayu/Desktop/ptalklearnweb`（只讀，未改動既有程式碼）
> 評分屬專案內部健檢指標，不代表 Google 或任何 AI 平台的官方排名分數。最佳化不保證被 AI 引用或推薦。
> 驗證方式：讀原始碼＋實際 `npm run build` 並用 `next start` 對各路由 curl（狀態碼、HTML、meta）。未做 Lighthouse／CrUX 實測，相關項目標「待驗證」。

---

## 1. 專案架構分析

| 項目 | 實際內容（證據） |
|---|---|
| 框架 | Next.js 16.2.10 App Router、React 19.2.4、TypeScript、Tailwind v4（`package.json`） |
| 部署 | 未見 `vercel.json`／Dockerfile；`docs/route-evaluation.md` 提到 `https://p-talk-learning-map.vercel.app/`，推測為 Vercel（待驗證）。**尚無正式網域**（`README.md`「待補事項」） |
| 路由 | `/`（靜態 ○）、`/apps/[id]`（SSG ●，`generateStaticParams`，10 頁）、`/go/[id]`（動態 ƒ，302 轉址）、`/_not-found` |
| 渲染 | 全站 SSG，HTML 內已含主要文字（首頁約 43 KB HTML，h1、學習路線、App 列表皆在原始 HTML）。**不是純 CSR，AI 爬蟲可直接讀到內容** |
| 資料來源 | `data/apps.json`（App 名稱、tagline、功能、受眾、定價、`updated`）、`data/stores.ts`（商店 ID、上架狀態）、`data/videos.json`、`data/screenshots.json`；無後端 API |
| 公開頁面 | 首頁 `HomePage.tsx`（`"use client"`，但有 SSR 輸出）、10 個 App 介紹頁 |
| 媒體 | `public/videos` 27 MB、`public/screenshots` 4.7 MB、`public/icons` 484 KB；圖片走 `next/image`（lazy） |
| 分析/追蹤 | **無**（layout 無任何 script，package.json 無分析套件） |
| 現有 SEO | 根 `metadata`（title template＋description）、各 App 頁 `generateMetadata`（title＋description=tagline）、`<html lang="zh-Hant">`、`favicon.ico` |

產品定位（來自程式與資料）：PTalk 是台灣團隊的語言學習 App 系列，共 10 款（日文 7、英文多益 2、學習輔助 Lock In 1），官網是「導流到各 App 商店」的入口站，核心轉換 = 點下載（`/go/<id>` 或商店連結）。

## 2. 健檢摘要

**一句話**：技術底子好（全 SSG、HTML 可讀、語言標記正確），但「讓搜尋引擎與 AI 認得你」的設施幾乎是零：沒有 robots／sitemap／canonical／OG／結構化資料／分析，內容只有「首頁＋各 App 一頁」，也沒有隱私權政策與關於頁。

關鍵發現：
1. 🔴 `robots.txt`、`sitemap.xml` 都是 404（已實測）。
2. 🔴 沒有 canonical、`metadataBase`、OG／Twitter、分享圖；上線自訂網域後會有 `vercel.app` 與正式網域重複內容風險。
3. 🔴 首頁 meta description 與實際內容不符：寫「共 8 款…日文 6 款、英文 2 款」「回答 3 個問題」，實際是 10 款、只問 1 題（`app/layout.tsx:25`）。AI 與搜尋摘要會引用到錯的數字。
4. 🟠 公開頁面出現內部用語：`data/apps.json` 的 `pricing` 含「待確認」「備用顯示 NT$90」「後備價」等字樣（4 款），會被爬蟲與 AI 當成官方價格敘述。
5. 🟠 完全沒有 JSON-LD；各頁沒有 FAQ、比較、使用指南；`updated` 欄位有資料卻沒顯示在頁面。
6. 🟠 `/go/<id>` 是 302＋`no-store`，沒擋爬蟲，也沒有追蹤。
7. 🟢 優點：靜態輸出、每頁 title/h1 獨立、`lang="zh-Hant"`、截圖有 alt、不存在 noindex、404 狀態碼正確（`/apps/nope`=404）。

## 3. 總體評分

**總分 35 / 100，等級 F**（0–39，需全面改善；其中多數扣分是「缺少設施」而非「做錯」，補齊成本低）。

| 評估項目 | 滿分 | 現況 | P0+P1 後預估 | 全部完成預估 |
|---|---:|---:|---:|---:|
| 爬蟲與搜尋索引能力 | 15 | 5 | 14 | 14 |
| HTML 與技術 SEO | 15 | 7 | 13 | 14 |
| 結構化資料 | 10 | 0 | 8 | 9 |
| AI 搜尋可讀性 | 20 | 9 | 14 | 18 |
| 內容品質與搜尋意圖 | 15 | 5 | 8 | 13 |
| 品牌可信度與 E-E-A-T | 10 | 3 | 7 | 9 |
| 網站效能 | 10 | 6 | 7 | 8 |
| 成效追蹤能力 | 5 | 0 | 4 | 5 |
| **總分** | **100** | **35** | **75（B）** | **90（S 邊緣，視內容實際成效）** |

**評估涵蓋率**：可由原始碼／建置結果直接判定的項目約佔 93 分；**待驗證 ≈ 7 分**（Core Web Vitals 實測約 5 分、CDN/WAF 對爬蟲的實際行為約 1 分、Search Console／Bing 是否已驗證約 1 分）。上表「效能」得分為依程式碼（SSG、next/image、lazy、影片 `preload="metadata"`）給的保守估計，實測前不視為定論。

---

## 4. 評分依據與程式碼證據

### 4.1 爬蟲與搜尋索引能力 — 5 / 15
- 已完成（+5）：全站可索引、無 noindex／nofollow（grep 無 `robots` metadata）；`/` 200、`/apps/<id>` 200、不存在的 id 404；SSG 內容完整。
- 缺失（−10）：
  - 無 `robots.txt`（`curl /robots.txt` → 404）　−3
  - 無 `sitemap.xml`（404），也無自動更新機制　−4
  - 無 canonical　−2
  - `/go/*` 未 Disallow、302＋no-store，爬蟲會浪費額度；`/go/<不存在>` 還 302 到首頁（軟 404 風格）　−1
- 相關檔案：`app/`（無 robots.ts／sitemap.ts）、`app/go/[id]/route.ts`
- 待驗證：Vercel 防火牆／Bot Protection 是否擋 `OAI-SearchBot`、`PerplexityBot`、`ClaudeBot`、`Bingbot`（程式內無任何 WAF 設定）。
- 未發現私人／後台頁面外洩（無 admin、無 API route 除 `/go`）。

### 4.2 HTML 與技術 SEO — 7 / 15
- 已完成（+7）：`lang="zh-Hant"`；`<main>`、`<footer>`、`<section aria-labelledby>`、`<ol>/<ul>` 語意；每個 App 頁獨立 `title`（「壽司日檢 介紹｜PTalk 學習地圖」）與 `description`；每頁單一 h1；h2/h3 階層合理（`app/apps/[id]/page.tsx`）；viewport 設定；截圖有 alt（`Screenshots.tsx:59`、實測「滑卡背單字」）。
- 缺失（−8）：
  - 無 `metadataBase`、canonical　−2
  - 無 Open Graph／Twitter Card／分享圖（README 自承未設）　−3
  - App 頁 description 只是一句 tagline（15–25 字），過短且不含平台、價格、對象　−1
  - 首頁 h1「日文單字背了又忘？」沒有品牌與產品類別，且首頁 description 數字過時　−1
  - App 圖示 `alt=""`（`AppBadge.tsx:32`，裝飾性可接受；但連結內只有圖示時缺可讀名稱，需確認旁邊有文字）　−0.5
  - 無 `app/icon`／apple-touch-icon／manifest（僅 favicon.ico）　−0.5
- hreflang：單一語系（zh-Hant），不需要；若日後出英文版再加。

### 4.3 結構化資料 — 0 / 10
- 全專案無 `application/ld+json`（建置後 HTML 實測無）。
- 缺失：Organization、WebSite、各 App 的 `MobileApplication`、BreadcrumbList、FAQPage 全無。

### 4.4 AI 搜尋可讀性 — 9 / 20
- 已完成（+9）：內容在 HTML 內（非純 CSR）；App 頁有「可以做什麼」功能清單、「適合你，如果／先別下載，如果」、免費範圍（`pricing`）、學習等級與下一站——這些是很好的可引用段落；品牌名「PTalk」與 App 名稱一致。
- 缺失（−11）：
  - 沒有「PTalk 是什麼」的清楚定義段落（首頁直接講痛點）　−2
  - 沒有明確的「支援平台」文字（只有按鈕，且 Lock In 僅 iPhone、壽司轉珠 iPhone 審核中——這些只在小字提示）　−2
  - 價格文字含內部備註（「待確認」「後備價」，`data/apps.json:391,609,736,864`），且未獨立成價格表　−2
  - 無 FAQ、無比較表（例如「壽司日檢 vs 忍者信鴿」）、無操作教學　−3
  - 無 llms.txt（選用，不扣主要分，但缺機器可讀的站點摘要）　−1
  - 部分資訊只在影片/截圖（影片無字幕/逐字稿，無 `VideoObject`）　−1

### 4.5 內容品質與搜尋意圖 — 5 / 15
- 已完成（+5）：每款 App 有受眾、功能、定價、前後站資料，用語自然、無關鍵字堆疊。
- 缺失（−10）：全站僅 11 個可索引 URL；沒有針對「怎麼學五十音」「日檢單字 App 推薦」「多益單字 App」等搜尋意圖的任何頁面；沒有使用指南／新手教學／比較／更新紀錄。見第 10 節規劃。

### 4.6 品牌可信度與 E-E-A-T — 3 / 10
- 已完成（+3）：footer 有聯絡 Email 與 Threads；商店連結來自真實 `stores.ts`。
- 缺失（−7）：無關於我們／團隊介紹　−2；無隱私權政策與服務條款頁（各 App 上架時應已有，官網應連結過去；位置待確認）　−2；`updated` 日期未顯示　−1；Threads 只是文字不是連結　−1；無真實使用者評價（不得捏造，可改引用商店公開評分並註明來源與日期）　−1。

### 4.7 網站效能 — 6 / 10（待驗證）
- 程式碼面良好：全靜態（○/●）；`next/image` 自動 WebP＋lazy；字體 `display: swap`，中文字體 `preload: false`；影片 `preload="metadata"`、尊重 reduced motion（`AutoVideo.tsx`）。
- 風險：首頁同時帶多支 mp4（`public/videos` 共 27 MB，單檔約 0.4–1 MB）；首屏影片可能是 LCP 元素；Noto Sans TC 載入造成 CLS／FOUT 待驗證；`HomePage` 為 client component，hydration JS 大小未量測。
- **LCP／INP／CLS／bundle 實際數字：待驗證**（建議用 PageSpeed Insights 與 `@next/bundle-analyzer`，不在此捏造）。

### 4.8 成效追蹤能力 — 0 / 5
- 無 GA4／Plausible／Vercel Analytics、無 UTM 處理、無下載點擊事件；Search Console／Bing Webmaster 是否已驗證：待驗證。
- 機會：所有下載都經過 `/go/<id>` 或商店連結，是天然的轉換追蹤點。

---

## 5. 已完成項目

- [x] 全站 SSG，主要內容在原始 HTML
- [x] `lang="zh-Hant"`，viewport
- [x] 每個 App 頁獨立 title / description / h1
- [x] 語意化版面（main/footer/section/list）
- [x] 截圖 alt、圖片 lazy、影片 reduced-motion
- [x] 404 狀態碼正確；無 noindex
- [x] 品牌名稱與 App 名稱一致；各 App 有「適合／不適合誰」「免費範圍」
- [x] 聯絡 Email、Threads 帳號
- [x] 未上架 App（壽司口說）不顯示下載連結，不會誤導（`released=false`）

## 6. 缺失與風險

| # | 風險 | 嚴重度 |
|---|---|---|
| 1 | 無 robots／sitemap | 高 |
| 2 | 無正式網域；無 canonical／metadataBase，`vercel.app` 預覽網域可能與未來正式網域重複被索引 | 高 |
| 3 | 首頁描述數字過時（8 款／3 個問題） | 高 |
| 4 | 價格文字含「待確認」等內部用語 | 中高 |
| 5 | 無 OG／分享圖，Threads／LINE 分享沒有預覽 | 中 |
| 6 | 無結構化資料 | 中 |
| 7 | 缺隱私權政策／關於頁（信任與商店審核對照） | 中 |
| 8 | 內容廣度不足，無搜尋意圖頁面 | 中 |
| 9 | `/go` 無追蹤、未排除爬取 | 中低 |
| 10 | 無分析工具，無法衡量任何優化成效 | 中 |
| 11 | 資料不一致風險：`README` 寫 8／9 款，實際 `apps.json` 10 款；`sushispeak` 無 `updated` 與圖示（`NO_ICON`） | 低 |

---

## 7. 優化清單（P0–P3）

> 複雜度：S＝<1 小時、M＝半天、L＝1–3 天。所有方案沿用 App Router 內建 Metadata API（已讀 `node_modules/next/dist/docs/01-app` 對應 `robots.md`、`sitemap.md`、`json-ld.md`、`generate-metadata.md`），不新增套件。

### P0 — 重大問題

**P0-1　建立 robots.ts 與 sitemap.ts**
- 問題：兩者皆 404。位置：`app/`。影響：全站索引發現、AI 爬蟲政策。
- 方案：新增 `lib/site.ts`（網域單一來源）、`app/robots.ts`、`app/sitemap.ts`，sitemap 由 `apps` 資料自動產生（新增 App 自動納入）。
- 新增檔案：`lib/site.ts`、`app/robots.ts`、`app/sitemap.ts`　複雜度：S　驗收：`/robots.txt`、`/sitemap.xml` 200，sitemap 含 `/` 與 10 個 `/apps/<id>`。

```ts
// lib/site.ts
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://p-talk-learning-map.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "PTalk 學習地圖";
```
```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/go/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
// 預設不封鎖 Googlebot / Bingbot / OAI-SearchBot / PerplexityBot / ClaudeBot（官網目的就是被引用）
```
```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { apps } from "@/lib/apps";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...apps.map((a) => ({
      url: `${SITE_URL}/apps/${a.id}`,
      lastModified: a.updated, // 沒有 updated 的 App 欄位留空即可，勿用 new Date() 造假
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
```
（`AppData` 型別需補 `updated?: string`——`apps.json` 已有此欄位，型別尚未宣告。）

**P0-2　`metadataBase`、canonical、修正首頁 description**
- 位置：`app/layout.tsx:19-27`、`app/apps/[id]/page.tsx:generateMetadata`。
- 方案：
```ts
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "PTalk 學習地圖｜日文與多益學習 App 推薦", template: "%s｜PTalk 學習地圖" },
  description: `PTalk 是台灣團隊開發的語言學習 App 系列，共 ${apps.length} 款，涵蓋日文（零基礎到 N1）、多益與學習輔助。回答一個問題，告訴你現在該下載哪一款。`,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "zh_TW", siteName: SITE_NAME, url: "/" },
  twitter: { card: "summary_large_image" },
};
```
  描述的 App 數量用 `apps.length` 動態計算，避免再次過時（並注意「每款都可免費下載」需排除未上架；以「免費下載」＋即將上架說明取代）。App 頁加 `alternates: { canonical: \`/apps/${id}\` }`。複雜度：S　驗收：view-source 見 `<link rel="canonical">`、description 數字正確。

**P0-3　清掉對外頁面的內部備註**
- 位置：`data/apps.json` `pricing`（第 391、609、736、864 行附近：「待確認」「後備價」「備用顯示」）。
- 方案：改成面向用戶的描述，例如「免費下載；每日練習有次數上限，看廣告可補充；另有買斷制內購（價格以商店顯示為準）」。**價格數字未經確認前不要寫入結構化資料**。需要產品負責人確認文案。複雜度：S　驗收：全站 HTML grep 無「待確認」「後備」。

### P1 — 高優先度

**P1-1　分享圖與完整 OG/Twitter**
- 新增 `app/opengraph-image.tsx`（站台預設）與 `app/apps/[id]/opengraph-image.tsx`（以 App 圖示＋名稱＋tagline 產生，用 `next/og` `ImageResponse`）；`generateMetadata` 補 `openGraph.title/description`。中文字型需內嵌（Noto Sans TC 子集），或先改用靜態 `public/og/<id>.png`（較省事）。複雜度：M　驗收：Facebook Sharing Debugger／Threads／LINE 預覽出圖。

**P1-2　JSON-LD（只用符合實際內容的類型）**
- 新增 `components/JsonLd.tsx`；首頁輸出 `Organization`＋`WebSite`；App 頁輸出 `MobileApplication`（或遊戲類用 `VideoGame`？壽司轉珠為遊戲，可評估）＋`BreadcrumbList`。
- 規則：**不放 `aggregateRating`、`review`、`offers.price`（價格未確認）、使用者數**；`offers` 只可寫 `price: 0` 於「下載免費」且 App 內購以文字說明——可先省略 `offers`。
```tsx
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
```
```tsx
// app/apps/[id]/page.tsx（節錄）
const ld = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: app.name,
  description: app.tagline,
  applicationCategory: "EducationalApplication",
  operatingSystem: [iosUrl(app.id) && "iOS", androidUrl(app.id) && "Android"].filter(Boolean).join(", "),
  inLanguage: "zh-Hant",
  downloadUrl: iosUrl(app.id) ?? androidUrl(app.id) ?? undefined,
  url: `${SITE_URL}/apps/${app.id}`,
  image: `${SITE_URL}/icons/${app.id}.png`,
  publisher: { "@type": "Organization", name: "PTalk", url: SITE_URL },
};
```
  `released=false`（壽司口說）時不輸出 `downloadUrl`。複雜度：M　驗收：Google Rich Results Test／Schema Markup Validator 無錯誤；JSON 內容與頁面一致。

**P1-3　首頁加「PTalk 是什麼」定義段落＋平台／價格總表**
- 位置：`components/HomePage.tsx`（或新增 server component `components/AboutBlock.tsx`，避免增加 client JS）。
- 內容：一段 60–100 字定義（誰做的、做什麼、給誰）；表格列出 10 款 App 的語言、等級、支援平台（iPhone／Android／僅 iPhone／即將上架）、免費方式（廣告／買斷／訂閱——僅用已確認的敘述）。表格資料全部由 `apps.json`＋`stores.ts` 產生，保證與頁面一致。複雜度：M　驗收：HTML 中有 `<table>`，AI 問「PTalk 有哪些 App、哪些支援 Android」可直接引用。

**P1-4　App 頁 description 改為完整一句＋顯示更新日期**
- `generateMetadata` description 組合：`${name}是${langLabel}${stageRange}的學習 App：${tagline}。${平台}。`（約 70–110 字）；頁尾顯示「最後更新：{updated}」。複雜度：S。

**P1-5　`/go/*` 處理**
- robots 已 Disallow；`/go/<不存在>` 改回 404 或維持導回首頁（保持現狀可，但須在報告中知悉）；加上 `X-Robots-Tag: noindex`。複雜度：S。

### P2 — 一般優化

**P2-1　信任頁面**：新增 `app/about/page.tsx`（團隊與產品理念，**只寫真實資訊**，由產品負責人提供文案）、`app/privacy/page.tsx`（或 footer 連到各 App 既有隱私權政策 URL，需向負責人索取）、footer 加 Threads 連結與頁面連結。複雜度：M。
**P2-2　更新紀錄頁** `app/changelog/page.tsx`（由 `apps.json.updated` 與商店版本資訊組成；沒有真實版本說明前先不建）。複雜度：S–M。
**P2-3　效能實測與調校**：PageSpeed Insights 量首頁與一個 App 頁；若 LCP 為影片，加 `poster`（`AutoVideo` 目前以 `preload="metadata"`），首屏只載一支影片；`@next/bundle-analyzer` 檢查 `HomePage` client bundle，將靜態區塊（痛點清單、路線表）拆成 server component。複雜度：M。
**P2-4　圖示與 manifest**：`app/icon.png`、`app/apple-icon.png`。複雜度：S。
**P2-5　AppBadge 可讀名稱**：確認以圖示為唯一內容的連結有 `aria-label`／相鄰文字。複雜度：S。
**P2-6　README 與資料一致性**：README 的「8 款／9 款」改為由資料驗證；新增 vitest 測試「每款 App 有 updated、description 不含『待確認』」。複雜度：S。

### P3 — 進階優化

- **P3-1 `llms.txt`**（選用，非排名必要條件）：`app/llms.txt/route.ts` 由 `apps` 動態輸出站點摘要與各 App 一行說明＋連結。複雜度：S。
- **P3-2 AI 引用監控**：每月手動／腳本向 ChatGPT、Gemini、Perplexity、Claude 詢問第 10 節的 20 題，記錄是否提及 PTalk 與連結（Google Sheet 即可，免費）。
- **P3-3 競品比較頁**：誠實比較（見 10 節），避免詆毀性內容。
- **P3-4 內容自動化**：由 `apps.json` 生成「等級×能力」比較頁，內容仍需人工審核，禁止批量低品質文章。
- **P3-5 `VideoObject`**：僅在影片有標題、說明、縮圖並加上字幕／逐字稿後才加。

---

## 8. 具體技術實作方式（摘要）

1. 先建 `lib/site.ts`，網域用環境變數 `NEXT_PUBLIC_SITE_URL`（Vercel 專案設定）。**取得正式網域後，Vercel 上將 `*.vercel.app` 設為 301 轉到正式網域**，並在 Search Console 用網域資源驗證。
2. `robots.ts`／`sitemap.ts`／`metadataBase`／canonical（P0）一次完成，並用既有 `npm run build` 驗證路由列表出現 `/robots.txt`、`/sitemap.xml`。
3. 結構化資料全部由 `data/*.json`、`data/stores.ts` 計算，避免手寫第二份資料而與頁面不一致。
4. 不引入新套件；`next/og` 內建，JSON-LD 用自製小元件（`<` 轉義以防 XSS，見 Next 官方指南）。

## 9. 建議新增及修改的檔案

| 動作 | 檔案 | 階段 |
|---|---|---|
| 新增 | `lib/site.ts` | P0 |
| 新增 | `app/robots.ts`、`app/sitemap.ts` | P0 |
| 修改 | `app/layout.tsx`（metadataBase、description、OG、canonical） | P0 |
| 修改 | `app/apps/[id]/page.tsx`（canonical、description、OG、JSON-LD、更新日期） | P0/P1 |
| 修改 | `data/apps.json`（清理 pricing 內部備註） | P0 |
| 修改 | `lib/apps.ts`（`AppData` 補 `updated?`） | P0 |
| 新增 | `components/JsonLd.tsx` | P1 |
| 新增 | `app/opengraph-image.tsx`、`app/apps/[id]/opengraph-image.tsx`（或 `public/og/*`） | P1 |
| 修改 | `components/HomePage.tsx`／新增 `components/AboutBlock.tsx`（定義＋比較表） | P1 |
| 修改 | `app/go/[id]/route.ts`（X-Robots-Tag、點擊記錄） | P1/P2 |
| 修改 | `components/SiteFooter.tsx`（Threads 連結、About/Privacy 連結） | P2 |
| 新增 | `app/about/page.tsx`、`app/privacy/page.tsx`、`app/faq/page.tsx`、`app/changelog/page.tsx` | P2 |
| 新增 | `app/guides/[slug]/page.tsx` ＋ `content/guides/*.md`、`app/compare/[slug]/page.tsx` | P2/P3 |
| 新增 | `app/llms.txt/route.ts` | P3 |
| 新增 | `lib/*.test.ts`（sitemap／metadata 一致性測試） | P2 |

---

## 10. AI 搜尋問題與內容建設規劃

### 10.1 目標客群與關鍵字
- **客群**：台灣華語使用者——（a）零基礎要學日文／五十音；（b）準備日檢 N5–N1；（c）想改善日文聽力／口說；（d）要考多益；（e）想減少滑手機、專心學習。
- **核心字**：日文學習 App、五十音 App、日檢單字 App、多益單字 App。
- **長尾字**：五十音諧音記憶、日文手寫練習 App、日檢 N5 單字每天背、日文口說練習 App、多益單字 App 推薦、日文聽力練習 App、學日文 App 免費、鎖手機專心讀書 App。

### 10.2 20 組目標 AI 搜尋問題（對應頁面）

| # | 使用者可能問 AI | 對應頁面（建議） | 現況 |
|---|---|---|---|
| 1 | 完全沒學過日文，該從哪個 App 開始？ | `/` 定義段＋`/guides/japanese-for-beginners` | 部分（首頁推薦邏輯需文字化） |
| 2 | 有沒有用中文諧音記五十音的 App？ | `/apps/kana5min` | 有頁，缺 FAQ |
| 3 | 五十音一直背不起來怎麼辦？ | `/guides/kana-memorize` | 無 |
| 4 | 日檢 N5 單字用什麼 App 背？ | `/apps/sushijp`、`/guides/jlpt-n5-vocab-app` | 部分 |
| 5 | 每天 5 分鐘背日文單字的 App？ | `/apps/sushijp` | 部分 |
| 6 | 日文聽力練習 App 推薦？ | `/apps/ninja-pigeon`、`/compare/japanese-listening-apps` | 部分 |
| 7 | 日文看得懂但聽不懂怎麼練？ | `/guides/japanese-listening-practice` | 無 |
| 8 | 有沒有練日文口說、開口說的 App？ | `/apps/koko`、`/apps/sushispeak` | 有頁 |
| 9 | 去日本旅遊要學哪些日文句子？ | `/guides/japan-travel-phrases`（KOKO 場景） | 無 |
| 10 | 日文漢字怎麼練手寫？有 App 嗎？ | `/apps/hitofude` | 有頁 |
| 11 | 多益單字 App 哪個好？ | `/apps/pizzatoeic`、`/compare/toeic-vocab-apps` | 部分 |
| 12 | 多益聽力閱讀文法怎麼練？ | `/apps/rooster-hero` | 部分 |
| 13 | 披薩多益和公雞超人差在哪？ | `/compare/pizzatoeic-vs-rooster-hero` | 無 |
| 14 | 壽司日檢和忍者信鴿該選哪個？ | `/compare/sushijp-vs-ninja-pigeon` | 無 |
| 15 | 有沒有免費的日文學習 App？要不要付費？ | `/pricing`（價格與免費範圍總表） | 分散在各頁 |
| 16 | PTalk 是什麼？是哪裡的公司／團隊？ | `/about` | 無 |
| 17 | PTalk 有哪些 App？支援 iPhone 和 Android 嗎？ | `/` 總表 | 部分（無表格） |
| 18 | 學習時一直滑手機，有沒有鎖 App 的工具？ | `/apps/lockin` | 有頁 |
| 19 | 日文學習路線：從零基礎到 N1 怎麼規劃？ | `/guides/japanese-learning-roadmap`（沿用首頁路線格） | 首頁有圖，缺文字 |
| 20 | 轉珠遊戲學日文單字有效嗎？ | `/apps/sushitower` | 有頁 |
| 21 | 日文學習 App 離線能用嗎？廣告多嗎？ | `/faq`（各 App 實際狀況，需產品確認） | 無 |
| 22 | 壽司口說什麼時候上架？ | `/apps/sushispeak`＋`/changelog` | 有頁（即將上架） |

### 10.3 優先建立的頁面（依價值排序）

**① `/faq`（常見問題）**　建議優先度最高
- Title：`PTalk 常見問題｜App 免費嗎、支援哪些平台、該先下載哪一款`
- Description：`PTalk 學習 App 的價格、支援平台、適合對象與下載選擇，一次看懂。`
- H1：PTalk 常見問題；H2：價格與免費範圍／支援平台／該選哪一款／聯絡與回報問題
- Schema：`FAQPage`（頁面可見的問答必須與 JSON-LD 一致）　內部連結：全部 App 頁　轉換：點下載
- 搜尋意圖：資訊／導購。目標問題：#15、#17、#21。

**② `/about`（關於 PTalk）**
- Title：`關於 PTalk｜台灣團隊開發的語言學習 App`　（內容由真人提供，不捏造經歷）
- H1：關於 PTalk；H2：我們在做什麼／為什麼做／聯絡我們／官方社群
- Schema：`Organization`（sameAs：Threads）。目標問題：#16。

**③ `/compare/sushijp-vs-ninja-pigeon`、`/compare/pizzatoeic-vs-rooster-hero`**
- Title：`壽司日檢 vs 忍者信鴿｜日檢要先用哪一款？`
- H1：壽司日檢和忍者信鴿差在哪；H2：一句話差別／比較表（練什麼、等級、玩法、免費範圍）／怎麼選／兩款搭配用
- Schema：`WebPage`（含 `BreadcrumbList`）；表格資料取自 `apps.json`。目標問題：#13、#14。轉換：下載兩款其中之一。

**④ `/guides/kana-memorize`（五十音怎麼記）、`/guides/japanese-learning-roadmap`（零基礎到 N1）**
- Schema：`Article`（含作者、`datePublished`、`dateModified`）、`BreadcrumbList`。內容須含實例（例：諧音範例需來自 App 真實內容）。內部連結到 `/apps/kana5min`、`/apps/sushijp`。目標問題：#1、#3、#19。

**⑤ `/pricing`（價格與免費範圍總表）**：待所有價格確認後建立；只呈現已確認的敘述。目標問題：#15。
**⑥ `/changelog`**：以真實版本更新為準。目標問題：#22。

---

## 11. 成效追蹤方案（免費、最小）

| 目標 | 做法 | 成本 |
|---|---|---|
| 搜尋索引 | Google Search Console（網域驗證）＋Bing Webmaster Tools（可匯入 GSC），提交 `sitemap.xml` | 免費 |
| 流量 | Vercel Web Analytics 或 Plausible／GA4 擇一（建議 GA4 或 Vercel Analytics，避免自架成本）；注意隱私，不收個資，並在隱私權頁說明 | 免費 |
| 下載轉換 | 在 `/go/<id>` 記錄 id、平台、referrer（可寫 console／Vercel log 或送分析事件）；網站內商店按鈕加 `onClick` 事件 `download_click {app, store}` | 免費 |
| UTM | 對外貼文（Threads）連結固定加 `?utm_source=threads&utm_medium=social&utm_campaign=...`；`/go` 需保留參數 | 免費 |
| AI 導流辨識 | 以 referrer 辨識 `chatgpt.com`、`perplexity.ai`、`gemini.google.com`、`claude.ai`、`copilot.microsoft.com`；分析工具建立「AI referrer」分群 | 免費 |
| 品牌提及／AI 引用率 | 每月以第 10 節 20 題手動詢問 4 個 AI，記錄「是否提及 PTalk／是否附連結／提到哪一款」，試算表追蹤 | 免費 |
| 競品比較 | 同一批問題記錄 AI 推薦的其他 App（如多鄰國、LINE 等），僅作內部觀察 | 免費 |
| 商店端 | App Store Connect 的 Campaign link／Google Play 的 Store listing 實驗與流量來源報表，與官網 UTM 對照 | 免費 |

## 12. 分階段 Roadmap

| 階段 | 時程（建議） | 內容 | 預估得分 |
|---|---|---|---|
| Phase 0：先決條件 | 第 0 週 | 決定並購買正式網域、Vercel 綁定、設 `NEXT_PUBLIC_SITE_URL`；確認價格文案與隱私權政策 URL | — |
| Phase 1：P0 | 第 1 週 | robots／sitemap／metadataBase／canonical／修正 description／清除內部備註；GSC＋Bing 驗證並提交 sitemap | 35 → ~55 |
| Phase 2：P1 | 第 2–3 週 | OG 圖、JSON-LD、首頁定義＋比較表、App 頁 description 與更新日期、`/go` 處理、分析與下載事件 | ~55 → ~75 |
| Phase 3：P2 | 第 4–6 週 | `/faq`、`/about`、`/privacy`、`/changelog`、效能實測與調校、README／測試補強 | ~75 → ~83 |
| Phase 4：內容 | 第 2–3 個月 | 比較頁 2 篇、指南 2–3 篇（真人撰寫／審核）、`llms.txt`（選用）、每月 AI 引用追蹤 | ~83 → ~90 |

## 13. 改善後預估評分

見第 3 節表格：P0＋P1 完成約 **75（B）**；全部完成約 **88–90（A–S 邊緣）**。後段分數高度取決於內容品質與外部可信來源（外部引用／媒體報導不可由本站單獨達成，不得捏造）。

## 14. 測試與驗收標準

- [ ] `npm run build` 成功，路由列表含 `/robots.txt`、`/sitemap.xml`；`npm run lint`、`npx tsc --noEmit`、`npm test` 通過
- [ ] `curl -I /robots.txt`、`/sitemap.xml` → 200；sitemap 含首頁與全部 `/apps/<id>`，網址皆為正式網域
- [ ] 每頁 view-source 有唯一 `<title>`、`<meta name="description">`、`<link rel="canonical">`（指向正式網域）、OG／Twitter 標籤
- [ ] 全站 HTML grep 無「待確認」「後備價」「備用顯示」
- [ ] Rich Results Test／Schema Validator：各頁 JSON-LD 無錯誤；JSON 內資訊與頁面一致；無 rating／review／未確認價格
- [ ] `curl -A "OAI-SearchBot"`、`"PerplexityBot"`、`"ClaudeBot"`、`"Googlebot"`、`"bingbot"` 對 `/`、`/apps/sushijp` 皆 200 且內容完整（部署後在正式環境測）
- [ ] Search Console「已提交的 sitemap」成功讀取；URL Inspection 可索引；Bing Webmaster 已驗證
- [ ] `/go/<id>` 仍依裝置轉址（既有 `lib/platform.test.ts` 通過），並有 `X-Robots-Tag: noindex`
- [ ] PageSpeed Insights（行動版）首頁與 App 頁：LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1（實測後填入，未達標列為待辦）
- [ ] 分析工具可看到下載點擊事件與 AI referrer 分群
- [ ] 既有 UI／下載流程無退步（人工走過首頁推薦流程與各 App 頁）

## 15. 尚待驗證的項目

1. 實際部署平台與網域（目前只確認有 `p-talk-learning-map.vercel.app` 的紀錄）、Vercel 防火牆／Bot Protection 設定是否影響爬蟲。
2. Core Web Vitals（LCP／INP／CLS）與 JS bundle 大小——尚未實測，報告中不提供任何數字。
3. Google Search Console／Bing Webmaster 是否已驗證、目前被索引的頁數。
4. 各 App 的隱私權政策／服務條款網址（官網應連結）。
5. 價格敘述的最終文案與是否可對外公布（`apps.json` 四款含「待確認」）。
6. 官方社群連結（目前只有 Threads @ptalk.design，且無網址；是否有其他官方帳號）。
7. 團隊／品牌介紹文案（需真人提供，勿由 AI 捏造）。
8. 是否有可公開引用的真實評價或商店評分（需註明來源與日期）。
9. `sushitower` 的 iOS 上架狀態（`stores.ts` 仍待補 App Store ID）、`sushispeak` 上架時程與圖示。
