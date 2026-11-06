/**
 * 各 App 的商店連結與上架狀態。
 * released=false 的 App 在網站上顯示「即將上架」，不放下載按鈕。
 * 審核通過後：補上 iosId（若還是空字串）並把 released 改成 true。
 * 只有 Android 先上架時：released 改 true、加 iosPending: true；iPhone 通過後拿掉 iosPending。
 */
export type StoreInfo = {
  /** App Store 數字 id；空字串＝尚未取得 */
  iosId: string;
  /** Google Play 套件名稱 */
  androidPackage: string;
  released: boolean;
  /** iPhone 版還在審核（只有 Android 已上架）；true 時不給 App Store 連結 */
  iosPending?: boolean;
};

export const stores: Record<string, StoreInfo> = {
  kana5min: {
    iosId: "6827398112",
    androidPackage: "com.ptalk.kana5min",
    released: true, // Google Play 已上架（2026-11-06）
    iosPending: true,
  },
  sushitower: {
    // TODO: App Store id 待補（審核中，通過後補上並把 released 改 true）
    iosId: "",
    androidPackage: "com.ptalk.kaitensushi",
    released: true, // Google Play 已上架（2026-11-06）
    iosPending: true,
  },
  sushijp: {
    iosId: "6774095306",
    androidPackage: "com.ptalk.sushijp",
    released: true,
  },
  "ninja-pigeon": {
    iosId: "6782623839",
    androidPackage: "com.ptalk.ninjapigeon",
    released: true,
  },
  hitofude: {
    iosId: "6799118226",
    androidPackage: "com.ptalk.hitofude",
    released: true,
  },
  koko: {
    iosId: "6790465413",
    androidPackage: "com.ptalk.koko",
    released: true,
  },
  pizzatoeic: {
    iosId: "6790264861",
    androidPackage: "com.ptalk.pizzatoeic",
    released: true,
  },
  "rooster-hero": {
    iosId: "6792789892",
    androidPackage: "com.ptalk.roosterhero",
    released: true,
  },
  lockin: {
    iosId: "6789834810",
    // 只有 iPhone 版，Android 尚未推出
    androidPackage: "",
    released: true,
  },
  sushispeak: {
    // 尚未上架；通過審核後把 released 改 true
    iosId: "6831479919",
    androidPackage: "com.ptalk.sushispeak",
    released: false,
  },
};

export function iosUrl(id: string): string | null {
  const s = stores[id];
  return s && s.iosId && !s.iosPending ? `https://apps.apple.com/app/id${s.iosId}` : null;
}

export function androidUrl(id: string): string | null {
  const s = stores[id];
  return s && s.androidPackage
    ? `https://play.google.com/store/apps/details?id=${s.androidPackage}`
    : null;
}

export function isReleased(id: string): boolean {
  return Boolean(stores[id]?.released);
}
