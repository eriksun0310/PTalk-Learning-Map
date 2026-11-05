import Image from "next/image";
import type { AppData } from "@/lib/apps";

/** App 圖示：public/icons/<id>.png（256px，由各 App 專案的 icon.png 縮出） */
export function AppBadge({
  app,
  size,
  radius,
  className = "",
}: {
  app: AppData;
  size: number;
  radius: number;
  /** 舊參數：圖示改用真圖後不再使用 */
  colored?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={`/icons/${app.id}.png`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`flex-none ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
    />
  );
}
