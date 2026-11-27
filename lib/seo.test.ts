import { describe, expect, it } from "vitest";
import sitemap from "../app/sitemap";
import { apps } from "./apps";
import { appDescription, appJsonLd } from "./seo";

describe("SEO 資料一致性", () => {
  it("sitemap 涵蓋首頁與每款 App", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls.length).toBe(apps.length + 1);
    for (const a of apps) expect(urls.some((u) => u.endsWith(`/apps/${a.id}`)), a.id).toBe(true);
  });

  it("公開文字不含內部備註", () => {
    for (const a of apps) {
      const text = [a.pricing, a.tagline, a.audience, ...a.features.map((f) => f.desc)].join("\n");
      expect(text, a.id).not.toMatch(/待確認|後備價|備用顯示|預設顯示/);
    }
  });

  it("updated 若有填必須是 YYYY-MM-DD，且 description 夠完整", () => {
    for (const a of apps) {
      if (a.updated) expect(a.updated, a.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(appDescription(a).length, a.id).toBeGreaterThan(30);
    }
  });

  it("JSON-LD 不含評分、評論、價格", () => {
    for (const a of apps) expect(JSON.stringify(appJsonLd(a)), a.id).not.toMatch(/aggregateRating|review|offers|price/i);
  });
});
