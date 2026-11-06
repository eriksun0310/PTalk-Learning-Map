import { describe, expect, it } from "vitest";
import { isReleased } from "../data/stores";
import { apps, getVideos, howOf } from "./apps";

describe("apps", () => {
  it("每款 App 都有學習路線用的一句話", () => {
    for (const a of apps) expect(howOf(a.id), a.id).not.toBe("");
  });

  it("每款已上架的 App 都有示範影片（首頁推薦結果要用）", () => {
    for (const a of apps.filter((x) => isReleased(x.id))) expect(getVideos(a.id).length, a.id).toBeGreaterThan(0);
  });
});
