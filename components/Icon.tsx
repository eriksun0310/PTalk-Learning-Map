type Name =
  | "arrow-right"
  | "download"
  | "check"
  | "play"
  | "pause"
  | "chevron-left"
  | "chevron-right"
  | "menu"
  | "close"
  | "play-circle";

const PATHS: Record<Name, React.ReactNode> = {
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  download: <path d="M12 3v12M6 11l6 6 6-6M4 21h16" />,
  check: <path d="M5 12l5 5 9-10" />,
  play: <path d="M8 5l11 7-11 7z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  "chevron-left": <path d="M15 6l-6 6 6 6" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  "play-circle": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4z" />
    </>
  ),
};

/** 統一的單線條 SVG 圖示；純裝飾（aria-hidden），需要名稱的按鈕請在外層加 aria-label */
export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  className,
}: {
  name: Name;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
