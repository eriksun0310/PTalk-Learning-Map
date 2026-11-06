# PTalk 學習地圖官網

讓用戶一分鐘內知道「該下載哪一款 App」並按下載。共 9 款（含學習輔助 Lock In）：日文 7（諧音五十音、壽司轉珠、日日一字、壽司日檢、忍者信鴿、KOKO、壽司口說）、英文 2（披薩多益、公雞超人）。

技術：Next.js 16（App Router）、React 19、TypeScript、Tailwind v4、Vitest。
注意：Next 16 的寫法與舊版有差異，改程式前請先看 `node_modules/next/dist/docs/` 與 `AGENTS.md`。

## 怎麼啟動

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # ESLint
npx tsc --noEmit   # 型別檢查
npm test           # 單元測試（vitest）
npm run build      # 正式建置
npm run start      # 跑建置好的版本
```

## 頁面

| 路徑 | 說明 |
| --- | --- |
| `/` | 首頁：痛點標題＋影片 → 「你現在是？」選程度 → 當場出現推薦的 1 款（影片、3 個好處、下載）→ 學習路線（零基礎～N1，日／英切換）→ 痛點清單 → 全部 App |
| `/apps/<id>` | 各 App 介紹（`generateStaticParams` 預先產生 8 頁） |
| `/go/<id>` | 依 User-Agent 轉址：iPhone 到 App Store、Android 到 Google Play、其他回 `/apps/<id>` |

## 資料在哪

| 檔案 | 內容 |
| --- | --- |
| `data/apps.json` | 8 款 App 的名稱、一句話、語言、階段（stages）、技能（skills）、適合對象、功能、數字、定價、前後站（prev／next）。**內容以這份為準**，頁面不寫死數字。 |
| `data/videos.json` | 各 App 的螢幕錄影（`public/videos/<id>/1.mp4`…）與標題；沒有該 id 或陣列為空就顯示佔位框。 |
| `data/stores.ts` | 各 App 的 iOS id、Android 套件名、`released`。`released: false` 的顯示「即將上架」、不給下載連結。 |
| `lib/apps.ts` 的 `HOW` | 學習路線上每款 App 的一句話（講「怎麼學」） |
| `components/HomePage.tsx` | 首頁的程度選項（`LEVELS`：對應哪款＋3 個好處）、痛點清單（`PAINS`）、路線順序（`ROUTE_ORDER`） |
| `docs/design/*.dc.html` | 設計稿（版面、配色、字體、間距的依據） |

### 推薦規則

只問一題「你現在是？」：完全零基礎 → 諧音五十音；會五十音 → 壽司日檢；看得懂聽不懂 → 忍者信鴿；想開口說 → KOKO；要考多益 → 披薩多益。推薦的 App 還在審核時，改提示先用 `INTERIM` 裡的那款（諧音五十音 → 日日一字）。規則在 `components/HomePage.tsx` 的 `LEVELS`。

## 怎麼新增一款 App

1. 在 `data/apps.json` 加一筆（欄位照現有的）。`id` 就是網址 `/apps/<id>`。
2. 在 `data/stores.ts` 加 iOS id、Android 套件名、`released`。
3. 在 `lib/apps.ts` 的 `HOW` 加一句「怎麼學」（測試會檢查每款都有）。
4. 在 `components/HomePage.tsx` 的 `ROUTE_ORDER` 加進學習路線；要被推薦就改 `LEVELS`。
5. 放圖示 `public/icons/<id>.png`，影片與截圖照下面的方式同步。
6. `npm run build` 確認新頁面有產生。

## 怎麼新增或更換影片

1. 影片放 `public/videos/<id>/1.mp4`、`2.mp4`…（H.264、靜音、15–30 秒、直式手機畫面）。
2. 在 `data/videos.json` 加一筆：`"<id>": [{ "src": "/videos/<id>/1.mp4", "title": "標題（可空字串）" }]`。
3. 第一支會當作首頁卡片封面、結果頁與介紹頁的預設影片；多支時介紹頁會出現切換按鈕。

截圖：把圖片放 `public/screenshots/<id>/`，並在 `data/apps.json` 該 App 的 `media.screenshots` 填路徑陣列（例如 `["/screenshots/sushijp/1.png"]`），截圖區就會取代佔位框。

## 待補事項

- App 圖示（目前用單字縮寫色塊）。
- 各款截圖（`media.screenshots` 為空，顯示佔位框）。
- 影片：諧音五十音、KOKO 尚無錄影；多數 App 的影片還沒有標題。
- 商店：壽司轉珠 iOS id 待補；諧音五十音（iOS 審核中）、壽司轉珠（審核中）通過後把 `released` 改 `true`。
- 手機掃描用的 QR Code（結果頁目前是佔位框）。
- 價格：apps.json 中標示「待確認」的定價文字。
- 網站網域、分享圖（Open Graph）、favicon 尚未設定。
