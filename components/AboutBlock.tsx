import Link from "next/link";
import { apps, levelLabel } from "@/lib/apps";
import { platformText } from "@/lib/seo";

/** 首頁底部：PTalk 是什麼＋全部 App 一覽表（server component，資料全來自 apps.json／stores.ts） */
export function AboutBlock() {
  return (
    <section className="border-t border-line" aria-labelledby="about-title">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-10 md:gap-8 md:px-10 md:py-16">
        <div className="flex flex-col gap-3">
          <h2 id="about-title" className="m-0 text-[22px] font-black md:text-[32px]">
            PTalk 是什麼
          </h2>
          <p className="m-0 max-w-[760px] text-[15px] leading-[1.8] text-sub md:text-[17px]">
            PTalk 是台灣團隊開發的語言學習 App 系列，共 {apps.length} 款，涵蓋日文（零基礎到
            N1）、英文多益與學習輔助。每款 App 專注一種學法，例如記五十音、背單字、練聽力、開口說。
            學習路線上的 App 都可免費下載，部分功能另有廣告解鎖、買斷或訂閱，細節見各 App 介紹頁。
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm md:text-[15px]">
            <caption className="sr-only">PTalk 全部 App 的語言、等級、支援平台與費用</caption>
            <thead>
              <tr className="border-b border-line text-mute">
                <th scope="col" className="py-2.5 pr-4 font-bold">App</th>
                <th scope="col" className="py-2.5 pr-4 font-bold">語言與等級</th>
                <th scope="col" className="py-2.5 pr-4 font-bold">支援平台</th>
                <th scope="col" className="py-2.5 font-bold">費用</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-b border-line align-top">
                  <th scope="row" className="py-3 pr-4 font-bold">
                    <Link href={`/apps/${a.id}`}>{a.name}</Link>
                  </th>
                  <td className="py-3 pr-4 text-sub">{levelLabel(a)}</td>
                  <td className="py-3 pr-4 text-sub">{platformText(a.id)}</td>
                  <td className="py-3 text-sub">{a.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
