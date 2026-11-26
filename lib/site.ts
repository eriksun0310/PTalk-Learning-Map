/** 網站網域單一來源；拿到正式網域後在環境變數設定 NEXT_PUBLIC_SITE_URL */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://p-talk-learning-map.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "PTalk 學習地圖";
