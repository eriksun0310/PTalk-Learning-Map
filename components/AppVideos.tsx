"use client";

import { useState } from "react";
import type { VideoItem } from "@/lib/apps";
import { PhoneFrame } from "./PhoneFrame";

/** 手機框影片；有多支就在下方做切換按鈕 */
export function AppVideos({ name, videos }: { name: string; videos: VideoItem[] }) {
  const [i, setI] = useState(0);
  const cur = videos[i];

  return (
    <div className="flex flex-col items-center gap-4">
      <PhoneFrame
        key={cur?.src ?? "none"}
        src={cur?.src}
        label={`${name} 操作示範${cur?.title ? `：${cur.title}` : ""}`}
        placeholder={"[螢幕錄影]\n影片製作中"}
        showToggle
        className="h-[520px] w-[250px] rounded-[36px] border-[7px] md:h-[620px] md:w-[300px] md:rounded-[42px] md:border-8"
      />
      {videos.length > 1 && (
        <div role="group" aria-label="切換示範影片" className="flex flex-wrap justify-center gap-2">
          {videos.map((v, idx) => (
            <button
              key={v.src}
              type="button"
              aria-pressed={idx === i}
              onClick={() => setI(idx)}
              className={`min-h-10 rounded-full px-4 text-sm font-bold ${
                idx === i ? "bg-salmon text-white" : "bg-soft text-sub hover:text-ink"
              }`}
            >
              {v.title || `畫面 ${idx + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
