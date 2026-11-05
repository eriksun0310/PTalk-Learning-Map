"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * 靜音循環的螢幕錄影：捲到畫面內才播放、離開就暫停。
 * 使用者設定「減少動態效果」時不自動播放，改由播放鈕手動開始。
 */
export function AutoVideo({
  src,
  label,
  showToggle = false,
  className = "",
}: {
  src: string;
  label: string;
  showToggle?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    userPaused.current = mq.matches;

    const sync = () => setPlaying(!el.paused);
    el.addEventListener("play", sync);
    el.addEventListener("pause", sync);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("play", sync);
      el.removeEventListener("pause", sync);
    };
  }, [src]);

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        aria-label={label}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        className={`h-full w-full object-cover ${className}`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "暫停影片" : "播放影片"}
          className="absolute right-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-full border-0 bg-ink/80 text-white"
        >
          <Icon name={playing ? "pause" : "play"} size={18} />
        </button>
      )}
    </>
  );
}
