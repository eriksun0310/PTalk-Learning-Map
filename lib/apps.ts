import appsJson from "@/data/apps.json";
import videosJson from "@/data/videos.json";
import screenshotsJson from "@/data/screenshots.json";

/** none＝不是語言內容（例如 Lock In 這種學習輔助 App） */
export type Lang = "jp" | "en" | "none";

export type AppFeature = { title: string; desc: string; paid: boolean };

export type AppData = {
  id: string;
  name: string;
  tagline: string;
  language: Lang;
  /** support＝學習輔助（不分語言、等級） */
  kind?: "support";
  /** 學習輔助 App 幫你的地方，例如「專注」 */
  supports?: string[];
  stages: string[];
  skills: string[];
  audience: string;
  features: AppFeature[];
  counts: { label: string; value: number }[];
  pricing: string;
  prev: string[];
  next: string[];
  media: {
    video: string | null;
    poster: string | null;
    screenshots: string[];
    appStore: string | null;
    googlePlay: string | null;
  };
};

export type VideoItem = { src: string; title: string };

export const apps = appsJson as unknown as AppData[];

const videos = videosJson as Record<string, VideoItem[]>;

export function getApp(id: string): AppData | undefined {
  return apps.find((a) => a.id === id);
}

export function getVideos(id: string): VideoItem[] {
  return videos[id] ?? [];
}

const screenshots = screenshotsJson as Record<string, VideoItem[]>;

/** 截圖（由 scripts/sync_media.py 從桌面「所有的app 截圖」同步） */
export function getScreenshots(id: string): VideoItem[] {
  return screenshots[id] ?? [];
}

/** 卡片與圖示用的單字縮寫（App 圖示還沒提供前的替代） */
const INITIALS: Record<string, string> = {
  kana5min: "諧",
  sushitower: "轉",
  sushijp: "壽",
  "ninja-pigeon": "鴿",
  koko: "K",
  hitofude: "字",
  pizzatoeic: "披",
  "rooster-hero": "雞",
};

export function initialOf(app: AppData): string {
  return INITIALS[app.id] ?? app.name.slice(0, 1);
}

export function langLabel(lang: Lang): string {
  if (lang === "none") return "學習輔助";
  return lang === "jp" ? "日文" : "英文";
}

/** 例如「N5–N1」「零基礎」；英文固定顯示「多益」 */
export function stageRange(app: AppData): string {
  if (app.language === "en") return "多益";
  const s = app.stages;
  if (s.length === 0) return app.kind === "support" ? "全階段" : "";
  return s.length === 1 ? s[0] : `${s[0]}–${s[s.length - 1]}`;
}

/** 例如「日文・N5–N1」 */
export function levelLabel(app: AppData): string {
  return `${langLabel(app.language)}・${stageRange(app)}`;
}

/** 學習路線上每款 App 的一句話：講「怎麼學」，讓同一個等級的 App 看得出差別 */
const HOW: Record<string, string> = {
  kana5min: "用中文諧音記住五十音",
  sushitower: "玩轉珠遊戲拼出單字",
  hitofude: "一天一個字，手寫練習",
  sushijp: "每天 5 分鐘背日檢單字",
  "ninja-pigeon": "闖關練聽力、文法、閱讀",
  koko: "生活場景，一句句開口說",
  pizzatoeic: "每天 5 分鐘刷多益單字",
  "rooster-hero": "職場情境練多益題目",
  lockin: "鎖住手機干擾，專心去學",
};

export function howOf(id: string): string {
  return HOW[id] ?? "";
}
