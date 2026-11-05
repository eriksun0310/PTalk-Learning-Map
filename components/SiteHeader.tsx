"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

const NAV = [
  { href: "/#level", label: "幫我選" },
  { href: "/#route", label: "學習路線" },
  { href: "/#apps", label: "全部 App" },
];

/** variant="back" 用在手機的 App 介紹頁：左邊顯示返回首頁箭頭 */
export function SiteHeader({ back = false }: { back?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 py-3 pr-3 pl-2 md:px-10 md:py-6">
        {back && (
          <Link
            href="/"
            aria-label="回首頁"
            className="flex h-11 w-11 items-center justify-center md:hidden"
          >
            <Icon name="chevron-left" size={22} />
          </Link>
        )}
        <Link
          href="/"
          className={`items-baseline gap-2.5 no-underline flex`}
        >
          <span className="text-[18px] font-black tracking-[-0.5px] md:text-[22px] max-md:text-[20px]">
            PTalk
          </span>
          <span className="hidden text-sm text-mute md:inline">學習路線圖</span>
        </Link>

        <nav aria-label="主選單" className="hidden gap-7 text-[15px] md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="no-underline">
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center border-0 bg-transparent md:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="主選單"
          className="flex flex-col border-t border-line px-5 pb-2 md:hidden"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center border-b border-line text-base no-underline last:border-b-0"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
