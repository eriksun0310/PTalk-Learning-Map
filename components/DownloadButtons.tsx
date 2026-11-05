import { androidUrl, iosUrl, isReleased } from "@/data/stores";
import { Icon } from "./Icon";

const BASE =
  "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full px-7 text-[17px] font-bold no-underline";

/** 桌機：App Store／Google Play 兩顆；手機：單一「免費下載」依裝置轉址（/go/<id>）。 */
export function DownloadButtons({ appId, name }: { appId: string; name: string }) {
  if (!isReleased(appId)) {
    return (
      <div className="flex flex-col gap-1">
        <span
          className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-soft px-7 text-[17px] font-bold text-mute"
          role="status"
        >
          即將上架
        </span>
        <span className="text-[13px] text-mute">{name}正在審核中，通過後這裡會出現下載按鈕。</span>
      </div>
    );
  }
  const ios = iosUrl(appId);
  const android = androidUrl(appId);
  return (
    <>
      <a
        href={`/go/${appId}`}
        className={`${BASE} w-full bg-salmon text-white hover:bg-salmon-dark hover:text-white md:hidden`}
      >
        <Icon name="download" />
        免費下載
      </a>
      <div className="hidden flex-wrap items-center gap-3 md:flex">
        {ios && (
          <a href={ios} className={`${BASE} bg-salmon text-white hover:bg-salmon-dark hover:text-white`}>
            <Icon name="download" />
            App Store 免費下載
          </a>
        )}
        {android && (
          <a
            href={android}
            className={`${BASE} border-2 border-line bg-white text-ink hover:border-edge hover:text-ink`}
          >
            <Icon name="download" />
            Google Play 免費下載
          </a>
        )}
      </div>
    </>
  );
}
