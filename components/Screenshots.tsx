"use client";

import Image from "next/image";
import { useRef } from "react";
import { Icon } from "./Icon";

/** 截圖橫向捲動區。沒有截圖時顯示佔位框（用功能名稱當說明）。 */
export function Screenshots({
  shots,
  captions,
}: {
  shots: string[];
  captions: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const items =
    shots.length > 0
      ? shots.map((src, i) => ({ src, cap: captions[i] ?? "" }))
      : captions.slice(0, 5).map((cap) => ({ src: "", cap }));

  function scroll(dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * 460, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <div className="flex items-end justify-between gap-4">
        <h2 className="m-0 px-5 text-[22px] font-black md:px-0 md:text-[32px]">畫面</h2>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label="上一張"
            onClick={() => scroll(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-edge"
          >
            <Icon name="chevron-left" size={18} />
          </button>
          <button
            type="button"
            aria-label="下一張"
            onClick={() => scroll(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-edge"
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="App 截圖，可左右捲動"
        className="flex gap-3 overflow-x-auto px-5 pb-2 md:gap-5 md:px-0"
      >
        {items.map((s, i) => (
          <figure key={`${s.cap}-${i}`} className="m-0 flex w-[150px] flex-none flex-col gap-2 md:w-[210px] md:gap-2.5">
            <div className="relative flex h-[310px] items-center justify-center overflow-hidden rounded-[18px] bg-line font-mono text-[11px] text-mute md:h-[440px] md:rounded-[18px] md:text-xs">
              {s.src ? (
                <Image src={s.src} alt={s.cap} fill sizes="210px" className="object-cover" />
              ) : (
                <span>[截圖 {i + 1}]</span>
              )}
            </div>
            <figcaption className="text-[13px] text-sub md:text-sm">{s.cap}</figcaption>
          </figure>
        ))}
      </div>
      <span className="px-5 text-xs text-mute md:hidden">左右滑看更多</span>
    </div>
  );
}
