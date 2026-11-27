# GEO / SEO 待辦清單

> 對應 `GEO-AUDIT.md`。目前內部評分 35/100（F）；P0+P1 完成預估 ~75；全部完成預估 ~88–90。
> 複雜度：S＝<1 小時、M＝半天、L＝1–3 天。

## Phase 0：先決條件（需人決定）
- [ ] 決定並購買正式網域，Vercel 綁定並將 `*.vercel.app` 301 到正式網域（S）
- [ ] Vercel 設定環境變數 `NEXT_PUBLIC_SITE_URL`（S）
- [ ] 產品負責人確認各 App 價格對外文案（apps.json 4 款含「待確認」）
- [ ] 取得各 App 隱私權政策／服務條款 URL
- [ ] 準備「關於 PTalk」真實文案（團隊、理念；不捏造）
- [ ] 確認官方社群連結（Threads 網址、其他帳號）

## P0 — 重大
- [x] 新增 `lib/site.ts`（SITE_URL、SITE_NAME）（S）
- [x] 新增 `app/robots.ts`：允許全站、Disallow `/go/`、帶 sitemap（S）
- [x] 新增 `app/sitemap.ts`：由 `apps` 自動產生、`lastModified` 取 `updated`（S）
- [x] `lib/apps.ts` 的 `AppData` 補 `updated?: string`（S）
- [x] `app/layout.tsx`：`metadataBase`、canonical、OG、Twitter、description 改為動態 `apps.length`（修正「8 款／3 個問題」）（S）
- [x] `app/apps/[id]/page.tsx` `generateMetadata`：加 canonical（S）
- [x] 清除 `data/apps.json` `pricing` 內「待確認／後備價／備用顯示」等內部用語（S）
- [x] 驗收：`/robots.txt`、`/sitemap.xml` 200；全站 HTML 無「待確認」

## P1 — 高優先
- [x] 分享圖：`app/opengraph-image.tsx` + 各 App OG 圖（或 `public/og/<id>.png`）（M）
- [x] 新增 `components/JsonLd.tsx`（`<` 轉義）（S）
- [x] 首頁輸出 `Organization` + `WebSite` JSON-LD（S）
- [x] App 頁輸出 `MobileApplication` + `BreadcrumbList` JSON-LD；未上架不輸出 downloadUrl；不放 rating／review／未確認價格（M）
- [x] 首頁加「PTalk 是什麼」定義段落（server component）（S）
- [x] 首頁加「10 款 App × 語言／等級／平台／免費方式」比較表（由資料產生）（M）
- [x] App 頁 description 改為完整一句（含語言、等級、平台）（S）
- [x] App 頁顯示「最後更新：{updated}」（S）
- [x] `/go/[id]`：加 `X-Robots-Tag: noindex`；評估不存在 id 的處理（S）
- [ ] 安裝分析（GA4／Vercel Analytics／Plausible 擇一）並記錄下載點擊事件 `download_click`（M）
- [ ] 驗證 Google Search Console（網域）與 Bing Webmaster，提交 sitemap（S）
- [x] 驗收：Rich Results Test 無錯誤；Threads／LINE 分享有預覽圖

## P2 — 一般
- [ ] `/faq` 頁 + `FAQPage` JSON-LD（問答須頁面可見且一致）（M）
- [ ] `/about` 頁 + `Organization` sameAs（M）
- [ ] `/privacy`、服務條款（或 footer 連到各 App 既有政策）（S–M）
- [x] footer：Threads 改成連結，加 About／FAQ／Privacy 連結（S）
- [ ] `/changelog`（有真實版本說明後再做）（S–M）
- [ ] PageSpeed Insights 量測首頁與一個 App 頁，填入實測數字（S）
- [ ] 首屏影片加 poster、僅載一支；`@next/bundle-analyzer` 檢視 `HomePage` bundle，靜態區塊拆 server component（M）
- [ ] `app/icon.png`、`app/apple-icon.png`（S）
- [ ] 確認僅圖示的連結有 `aria-label`／相鄰文字（S）
- [x] 新增測試：sitemap 涵蓋全部 App、description 不含「待確認」、每款有 `updated`（S）
- [x] README 更新：款數、頁面清單、環境變數（S）

## P3 — 進階
- [ ] `/compare/sushijp-vs-ninja-pigeon`（M）
- [ ] `/compare/pizzatoeic-vs-rooster-hero`（M）
- [ ] `/guides/kana-memorize`、`/guides/japanese-learning-roadmap`（真人撰寫／審核；`Article` schema 含作者與日期）（L）
- [ ] `/pricing` 價格與免費範圍總表（價格確認後）（M）
- [ ] `app/llms.txt/route.ts`（選用，非排名必要條件）（S）
- [ ] 影片補字幕／逐字稿後再加 `VideoObject`（M）
- [ ] AI 引用追蹤：每月以 20 題詢問 ChatGPT／Gemini／Perplexity／Claude，記錄提及與連結（試算表）
- [ ] UTM 規範：Threads 貼文連結固定 utm 參數，`/go` 保留參數（S）
- [ ] AI referrer 分群（chatgpt.com、perplexity.ai、gemini.google.com、claude.ai、copilot.microsoft.com）（S）

## 待驗證
- [ ] Vercel 防火牆／Bot Protection 是否擋 OAI-SearchBot、PerplexityBot、ClaudeBot、Bingbot（部署後用 curl -A 測）
- [ ] Core Web Vitals 實測（LCP／INP／CLS）
- [ ] 目前被 Google／Bing 索引的頁數
- [ ] `sushitower` iOS App Store ID、`sushispeak` 上架時程與圖示
- [ ] 是否有可公開引用的真實評價／商店評分（須註明來源與日期）

## 驗收總表
- [ ] `npm run build`／`lint`／`npx tsc --noEmit`／`npm test` 全過
- [ ] 每頁唯一 title／description／canonical／OG
- [ ] 五個爬蟲 UA 對 `/` 與 `/apps/sushijp` 皆 200 且內容完整
- [ ] Search Console 讀取 sitemap 成功
- [ ] PageSpeed 行動版 LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1
- [ ] 下載點擊事件與 AI referrer 可在分析工具看到
