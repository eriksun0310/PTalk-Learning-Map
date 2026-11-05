import { AutoVideo } from "./AutoVideo";
import { Icon } from "./Icon";

/** 手機框：有影片就播放，沒有就顯示佔位。尺寸、框線、圓角由 className 決定。 */
export function PhoneFrame({
  src,
  label,
  placeholder,
  showToggle = false,
  className = "",
  iconSize = 40,
}: {
  src?: string;
  label: string;
  placeholder: string;
  showToggle?: boolean;
  className?: string;
  iconSize?: number;
}) {
  return (
    <div
      className={`relative overflow-hidden border-ink bg-ph ${className}`}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : `${label}（影片製作中）`}
    >
      {src ? (
        <AutoVideo src={src} label={label} showToggle={showToggle} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 p-2 text-center whitespace-pre-line font-mono text-[11px] text-mute md:text-[13px]">
          {iconSize > 0 && <Icon name="play-circle" size={iconSize} strokeWidth={1.5} />}
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  );
}
