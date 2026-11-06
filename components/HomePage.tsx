"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AppBadge } from "@/components/AppBadge";
import { AutoVideo } from "@/components/AutoVideo";
import { Icon } from "@/components/Icon";
import { isReleased } from "@/data/stores";
import { apps, getApp, getVideos, howOf } from "@/lib/apps";

/** 「你現在是？」：一題就給答案 */
const LEVELS = [
  {
    key: "zero",
    label: "完全零基礎",
    app: "kana5min",
    why: ["用中文諧音記假名，記得快", "筆順動畫帶你寫一遍", "每天幾分鐘就能學完一組"],
  },
  {
    key: "kana",
    label: "會五十音，想背單字",
    app: "sushijp",
    why: ["每天 5 分鐘，玩遊戲背日檢單字", "N5 到 N1 都有", "快忘記的單字會自動再出現"],
  },
  {
    key: "listen",
    label: "看得懂，但聽不懂",
    app: "ninja-pigeon",
    why: ["情境聽力，像真的在日本", "文法一關一關練", "短文閱讀，練到看得懂"],
  },
  {
    key: "speak",
    label: "想開口說日文",
    app: "koko",
    why: ["從機場到居酒屋 10 個場景", "一天一句，練到說得出口", "每句都有日本人發音"],
  },
  {
    key: "toeic",
    label: "要考多益",
    app: "pizzatoeic",
    why: ["每天 5 分鐘刷多益單字", "先測程度，從你的級數開始", "快忘記的單字會自動複習"],
  },
] as const;

/** 給還在猶豫的人：一個痛點對一款 App */
const PAINS = [
  { pain: "五十音背了好幾次，還是記不住", app: "kana5min" },
  { pain: "單字今天背，明天就忘", app: "sushijp" },
  { pain: "看得懂，聽不懂", app: "ninja-pigeon" },
  { pain: "去日本只會說「すみません」", app: "koko" },
  { pain: "漢字看得懂，寫不出來", app: "hitofude" },
  { pain: "多益單字書翻不完", app: "pizzatoeic" },
  { pain: "想讀書，手卻一直滑手機", app: "lockin" },
];

/** 學習路線：橫的是等級，直的是能力，格子裡放涵蓋那一級的 App 圖示（像遊戲關卡表） */
const LEVEL_COLS = {
  jp: ["零基礎", "N5", "N4", "N3", "N2", "N1"],
  en: ["入門", "初級", "中級", "高級"],
};

type SkillRow = {
  skill: string;
  /** 依序排；同一格有兩款時顯示後面那款 */
  apps: string[];
  /** 從這一級開始顯示「即將推出」 */
  soonFrom?: string;
};

const SKILL_ROWS: Record<"jp" | "en", SkillRow[]> = {
  jp: [
    { skill: "認字", apps: ["kana5min"] },
    { skill: "單字", apps: ["sushitower", "sushijp"] },
    { skill: "聽力閱讀", apps: ["ninja-pigeon"] },
    { skill: "口說", apps: ["koko", "sushispeak"] },
    { skill: "手寫", apps: ["hitofude"] },
  ],
  en: [
    { skill: "單字", apps: ["pizzatoeic"] },
    { skill: "聽力閱讀", apps: ["rooster-hero"] },
  ],
};

const supportApps = apps.filter((a) => a.kind === "support");

function LevelRoute({ highlight }: { highlight?: string }) {
  const [lang, setLang] = useState<"jp" | "en">("jp");
  const levels = LEVEL_COLS[lang];
  const rows = SKILL_ROWS[lang];
  const grid = { gridTemplateColumns: `64px repeat(${levels.length}, minmax(0, 1fr))` };
  const legend = [...new Set(rows.flatMap((r) => r.apps))].map((id) => getApp(id)!);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-fit rounded-full bg-soft p-1" role="tablist" aria-label="語言">
        {(["jp", "en"] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={lang === l}
            onClick={() => setLang(l)}
            className={`min-h-10 rounded-full px-5 text-[15px] font-bold ${
              lang === l ? "bg-white text-ink shadow-[0_1px_4px_rgba(0,0,0,0.12)]" : "text-mute"
            }`}
          >
            {l === "jp" ? "日文" : "英文（多益）"}
          </button>
        ))}
      </div>

      {/* 關卡表：同一個圖示連成一排＝那款 App 涵蓋的等級 */}
      <div className="flex flex-col">
        <div className="grid pb-2 text-center text-[12px] font-bold text-mute" style={grid}>
          <span />
          {levels.map((lv) => (
            <span key={lv} className="whitespace-nowrap">
              {lv}
            </span>
          ))}
        </div>
        {rows.map((r) => {
          const soonAt = r.soonFrom ? levels.indexOf(r.soonFrom) : -1;
          return (
            <div key={r.skill} className="grid items-center border-t border-line py-1.5" style={grid}>
              <span className="text-[14px] font-bold whitespace-nowrap">{r.skill}</span>
              {levels.map((lv, i) => {
                const a = r.apps
                  .map((id) => getApp(id)!)
                  .filter((x) => x.stages.includes(lv))
                  .pop();
                if (a) {
                  const on = highlight === a.id;
                  return (
                    <Link
                      key={lv}
                      href={`/apps/${a.id}`}
                      aria-label={`${r.skill}・${lv}：${a.name}`}
                      className="flex justify-center py-1"
                    >
                      <AppBadge
                        app={a}
                        size={36}
                        radius={9}
                        className={on ? "ring-[3px] ring-salmon ring-offset-1" : ""}
                      />
                    </Link>
                  );
                }
                if (soonAt >= 0 && i >= soonAt) {
                  return (
                    <span key={lv} className="flex justify-center py-1" title="即將推出">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border-[1.5px] border-dashed border-edge text-[10px] font-bold text-mute">
                        即將
                      </span>
                    </span>
                  );
                }
                return (
                  <span key={lv} className="flex justify-center py-1" aria-hidden="true">
                    <span className="h-9 w-9" />
                  </span>
                );
              })}
            </div>
          );
        })}
        <p className="m-0 border-t border-line pt-3 text-[13px] text-mute">
          同一個圖示連成一排，就是那款 App 涵蓋的等級。點圖示看介紹。
        </p>
      </div>

      {/* 圖示說明：每款一句「怎麼學」 */}
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
        {legend.map((a) => {
          const on = highlight === a.id;
          return (
            <li key={a.id}>
              <Link href={`/apps/${a.id}`} className="flex items-center gap-3 no-underline">
                <AppBadge app={a} size={40} radius={10} className={on ? "ring-[3px] ring-salmon ring-offset-2" : ""} />
                <span className="flex min-w-0 flex-col">
                  <span className={`text-[15px] leading-tight font-bold ${on ? "text-salmon" : ""}`}>{a.name}</span>
                  <span className="text-[13px] leading-snug text-mute">{howOf(a.id)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 學習輔助：不分語言、等級，每一站都用得到 */}
      {supportApps.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl bg-soft p-4">
          <span className="text-[14px] font-bold text-sub">每一站都用得到</span>
          {supportApps.map((a) => (
            <Link key={a.id} href={`/apps/${a.id}`} className="flex items-center gap-3 no-underline">
              <AppBadge app={a} size={40} radius={10} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[15px] leading-tight font-bold">{a.name}</span>
                <span className="text-[13px] leading-snug text-mute">{howOf(a.id)}</span>
              </span>
              <Icon name="chevron-right" size={18} className="text-edge" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** 推薦的 App 還在審核時，先推薦已上架的這款 */
const INTERIM: Record<string, string> = { kana5min: "hitofude" };

const btn =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-8 text-[17px] font-bold no-underline";
const btnPrimary = `${btn} bg-salmon text-white hover:bg-salmon-dark hover:text-white`;

export function HomePage() {
  const [level, setLevel] = useState<(typeof LEVELS)[number] | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function choose(l: (typeof LEVELS)[number]) {
    setLevel(l);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const app = level ? getApp(level.app)! : null;
  const next = app ? getApp(app.next[0]) : undefined;
  const interim = app && !isReleased(app.id) ? getApp(INTERIM[app.id] ?? "") : undefined;

  return (
    <main className="bg-white text-ink">
      {/* 頁首：只有品牌 */}
      <header className="mx-auto flex max-w-[1080px] items-center px-5 py-4 md:px-10 md:py-6">
        <span className="text-[20px] font-black tracking-[-0.5px]">PTalk</span>
      </header>

      {/* 1. 痛點標題 + 一支影片 + 一顆按鈕 */}
      <section className="mx-auto grid max-w-[1080px] items-center gap-8 px-5 pt-4 pb-14 md:grid-cols-[1fr_280px] md:gap-16 md:px-10 md:pt-12 md:pb-24">
        <div className="flex flex-col gap-5">
          <h1 className="m-0 text-[34px] leading-[1.25] font-black tracking-[-0.5px] md:text-[54px] md:leading-[1.15]">
            日文單字
            <br />
            背了又忘？
          </h1>
          <p className="m-0 text-[18px] leading-[1.6] text-sub md:text-[22px]">
            不是你不認真，
            <br />
            是還沒遇到<span className="font-bold text-salmon">對的方法</span>。
          </p>
          <p className="m-0 text-[15px] text-mute">每天 5 分鐘・全部免費・不用註冊</p>
          <a href="#level" className={`${btnPrimary} mt-2 w-full md:w-fit`}>
            找適合我的 App
            <Icon name="arrow-right" size={18} />
          </a>
        </div>
        <div className="mx-auto h-[500px] w-[240px] overflow-hidden rounded-[36px] border-[8px] border-ink md:h-[580px] md:w-[280px]">
          <AutoVideo src={getVideos("sushijp")[0].src} label="壽司日檢 操作示範" />
        </div>
      </section>

      {/* 2. 你現在是？ */}
      <section id="level" className="scroll-mt-4 bg-soft">
        <div className="mx-auto flex max-w-[640px] flex-col gap-5 px-5 py-14 md:py-20">
          <h2 className="m-0 text-[28px] font-black md:text-[36px]">你現在是？</h2>
          <div className="flex flex-col gap-3">
            {LEVELS.map((l) => {
              const on = level?.key === l.key;
              return (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => choose(l)}
                  aria-pressed={on}
                  className={`flex min-h-16 items-center justify-between rounded-2xl border-2 px-5 text-left text-[18px] font-bold transition-colors ${
                    on ? "border-salmon bg-white text-ink" : "border-transparent bg-white text-ink hover:border-line"
                  }`}
                >
                  {l.label}
                  <Icon name="arrow-right" size={20} className={on ? "text-salmon" : "text-edge"} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 結果：一款 App */}
      {level && app && (
        <section ref={resultRef} className="scroll-mt-4">
          <div className="mx-auto flex max-w-[640px] flex-col gap-6 px-5 py-14 md:py-20">
            <p className="m-0 text-[15px] font-bold text-salmon">最適合你的是</p>
            <div className="flex items-center gap-4">
              <AppBadge app={app} size={72} radius={18} />
              <div className="flex flex-col gap-1">
                <h2 className="m-0 text-[28px] font-black">{app.name}</h2>
                <span className="text-[15px] text-sub">{app.tagline}</span>
              </div>
            </div>
            <div className="mx-auto h-[420px] w-[200px] overflow-hidden rounded-[30px] border-[7px] border-ink">
              <AutoVideo key={app.id} src={getVideos(app.id)[0].src} label={`${app.name} 操作示範`} />
            </div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {level.why.map((w) => (
                <li key={w} className="flex items-center gap-3 text-[17px]">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-salmon text-white">
                    <Icon name="check" size={14} strokeWidth={3} />
                  </span>
                  {w}
                </li>
              ))}
            </ul>
            {isReleased(app.id) ? (
              <a href={`/go/${app.id}`} className={`${btnPrimary} w-full`}>
                免費下載
              </a>
            ) : (
              <div className="flex flex-col gap-3">
                <span className={`${btn} w-full bg-soft text-mute`}>審核中，即將上架</span>
                {interim && (
                  <Link
                    href={`/apps/${interim.id}`}
                    className="flex items-center gap-3 rounded-2xl bg-soft p-3 text-[15px] no-underline"
                  >
                    <AppBadge app={interim} size={40} radius={10} />
                    <span className="flex-1">
                      上架前，可以先用 <b>{interim.name}</b>
                      <br />
                      <span className="text-[13px] text-mute">{howOf(interim.id)}</span>
                    </span>
                    <Icon name="chevron-right" size={18} className="text-edge" />
                  </Link>
                )}
              </div>
            )}
            {next && (
              <Link href={`/apps/${next.id}`} className="text-center text-[15px] text-mute">
                學完之後，下一站：{next.name}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* 4. 學習路線：每款 App 在哪個等級 */}
      <section id="route" className="scroll-mt-4 border-t border-line">
        <div className="mx-auto flex max-w-[640px] flex-col gap-5 px-5 py-14 md:py-20">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-[24px] font-black md:text-[30px]">學習路線</h2>
            <p className="m-0 text-[15px] text-sub">找到你的等級和想加強的能力，就知道該用哪款。</p>
          </div>
          <LevelRoute highlight={app?.id} />
        </div>
      </section>

      {/* 5. 還在猶豫：一個痛點對一款 */}
      <section className="border-t border-line">
        <div className="mx-auto flex max-w-[640px] flex-col gap-5 px-5 py-14 md:py-20">
          <h2 className="m-0 text-[24px] font-black md:text-[30px]">你是不是也這樣？</h2>
          <ul className="m-0 flex list-none flex-col p-0">
            {PAINS.map((p) => {
              const a = getApp(p.app)!;
              return (
                <li key={p.app} className="border-b border-line last:border-b-0">
                  <Link href={`/apps/${a.id}`} className="flex min-h-[76px] items-center gap-4 py-3 no-underline">
                    <span className="flex-1 text-[17px] font-bold">{p.pain}</span>
                    <span className="flex flex-none items-center gap-2 text-[14px] text-mute">
                      <AppBadge app={a} size={40} radius={10} />
                      <Icon name="chevron-right" size={18} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 6. 全部 App（小） */}
      <section id="apps" className="scroll-mt-4 bg-soft">
        <div className="mx-auto flex max-w-[640px] flex-col gap-5 px-5 py-14">
          <h2 className="m-0 text-[20px] font-black">全部 App</h2>
          <ul className="m-0 grid list-none grid-cols-4 gap-x-3 gap-y-5 p-0">
            {apps.map((a) => (
              <li key={a.id}>
                <Link href={`/apps/${a.id}`} className="flex flex-col items-center gap-2 text-center no-underline">
                  <AppBadge app={a} size={60} radius={15} />
                  <span className="text-[12px] leading-tight font-bold text-sub">{a.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
