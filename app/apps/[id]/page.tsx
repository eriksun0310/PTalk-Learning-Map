import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppBadge } from "@/components/AppBadge";
import { AppVideos } from "@/components/AppVideos";
import { DownloadButtons } from "@/components/DownloadButtons";
import { Icon } from "@/components/Icon";
import { Screenshots } from "@/components/Screenshots";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { androidUrl, isReleased } from "@/data/stores";
import {
  apps,
  getApp,
  getScreenshots,
  getVideos,
  howOf,
  langLabel,
  stageRange,
  type AppData,
} from "@/lib/apps";

export function generateStaticParams() {
  return apps.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const app = getApp(id);
  if (!app) return {};
  return { title: `${app.name} 介紹`, description: app.tagline };
}

/** audience 欄位以「；」分成「適合誰」與「不適合誰」 */
function splitAudience(app: AppData) {
  const [fit, ...rest] = app.audience.split("；");
  return { fit, notFit: rest.join("；") };
}

export default async function AppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) notFound();

  const videos = getVideos(app.id);
  const shots = getScreenshots(app.id);
  const { fit, notFit } = splitAudience(app);
  const nexts = app.next.map(getApp).filter((a): a is AppData => !!a);
  const counts = app.counts.slice(0, 3);
  const released = isReleased(app.id);
  const meta = `${langLabel(app.language)}・${stageRange(app)}`;

  return (
    <>
      <SiteHeader back />
      <main>
        <section className="mx-auto grid max-w-[1200px] gap-x-[72px] px-5 pt-6 md:grid-cols-[300px_minmax(0,1fr)] md:px-10 md:pt-16 md:pb-20">
          <div className="flex flex-col gap-4 md:col-start-2 md:row-start-1 md:gap-7 md:self-end">
            <div className="flex items-center gap-3.5 md:gap-5">
              <AppBadge app={app} size={96} radius={22} className="max-md:!h-16 max-md:!w-16 max-md:!rounded-2xl" />
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[13px] font-bold text-salmon md:text-sm">{meta}</span>
                <h1 className="m-0 text-[32px] leading-[1.15] font-black md:text-[56px] md:leading-[1.1] md:tracking-[-1px]">
                  {app.name}
                </h1>
              </div>
            </div>
            <p className="m-0 text-base leading-[1.7] text-sub md:text-[21px]">{app.tagline}</p>
          </div>

          <div className="py-6 md:col-start-1 md:row-span-2 md:row-start-1 md:self-center md:py-0">
            <AppVideos name={app.name} videos={videos} />
          </div>

          <div className="flex flex-col gap-3 pb-7 md:col-start-2 md:row-start-2 md:gap-7 md:self-start md:pb-0">
            <ul className="order-2 m-0 grid list-none grid-cols-3 rounded-2xl bg-soft p-0 max-md:mt-4 md:order-none">
              {counts.map((c, i) => (
                <li
                  key={c.label}
                  className={`flex flex-col gap-0.5 px-4 py-3.5 md:gap-1 md:px-5 md:py-[18px] ${
                    i > 0 ? "border-l border-white" : ""
                  }`}
                >
                  <span className="text-2xl font-black md:text-4xl">{c.value}</span>
                  <span className="text-xs text-mute md:text-sm">{c.label}</span>
                </li>
              ))}
            </ul>
            <div className="order-1 flex flex-col gap-2.5 md:order-none">
              <DownloadButtons appId={app.id} name={app.name} />
              {released && (
                <span className={`text-[13px] text-mute ${androidUrl(app.id) ? "text-center md:hidden" : "max-md:text-center"}`}>
                  {androidUrl(app.id) ? "iPhone 開 App Store，Android 開 Google Play" : "目前只有 iPhone 版"}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="bg-soft py-9 md:py-[72px]">
          <div className="mx-auto max-w-[1200px] md:px-10">
            <Screenshots
              shots={shots.map((s) => s.src)}
              captions={shots.length > 0 ? shots.map((s) => s.title) : app.features.map((f) => f.title)}
            />
          </div>
        </section>

        <section className="mx-auto flex max-w-[1200px] flex-col px-5 py-9 md:gap-9 md:px-10 md:py-[88px]">
          <h2 className="m-0 mb-2 text-[22px] font-black md:mb-0 md:text-[32px]">可以做什麼</h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-x-14 p-0 md:grid-cols-2">
            {app.features.map((f, i) => (
              <li key={f.title} className="flex gap-3.5 border-t border-line py-4 md:gap-[18px] md:py-[22px]">
                <span className="pt-[3px] font-mono text-xs font-bold text-salmon md:pt-1 md:text-[13px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex min-w-0 flex-col gap-1 md:gap-1.5">
                  <span className="flex flex-wrap items-center gap-2 text-[17px] font-bold md:text-[19px]">
                    {f.title}
                    {f.paid && (
                      <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-bold text-mute">
                        進階
                      </span>
                    )}
                  </span>
                  <span className="text-sm leading-relaxed text-sub md:text-[15px] md:leading-[1.6]">
                    {f.desc}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="md:border-t md:border-line">
          <div className="mx-auto grid max-w-[1200px] gap-3 px-5 pb-8 md:grid-cols-3 md:gap-12 md:px-10 md:py-[72px]">
            {[
              { h: "適合你，如果", t: fit },
              {
                h: "先別下載，如果",
                t: notFit || "現在的程度或目標跟上面不符時，到路線圖找適合你現在的那一站。",
              },
              { h: "免費能用到哪", t: app.pricing },
            ].map((c) => (
              <div
                key={c.h}
                className="flex flex-col gap-1.5 rounded-2xl bg-soft p-[18px] md:gap-3 md:p-6"
              >
                <h3 className="m-0 text-base font-bold md:text-xl">{c.h}</h3>
                <p className="m-0 text-sm leading-relaxed text-sub md:text-base md:leading-[1.7]">
                  {c.t}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line" aria-labelledby="pos-title">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-10 md:px-10 md:py-16">
            <div className="flex flex-col gap-3">
              <h2 id="pos-title" className="m-0 text-[22px] font-black md:text-[28px]">
                適合等級
              </h2>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {(app.stages.length > 0 ? app.stages : [stageRange(app)]).map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-salmon-soft px-3.5 py-1 text-[14px] font-bold text-salmon"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {nexts.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="m-0 text-[18px] font-black md:text-[20px]">學完下一站</h3>
                <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
                  {nexts.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/apps/${n.id}`}
                        className="flex items-center gap-3 rounded-2xl bg-soft p-3.5 no-underline"
                      >
                        <AppBadge app={n} size={44} radius={11} />
                        <span className="flex flex-1 flex-col">
                          <span className="text-[16px] font-bold">{n.name}</span>
                          <span className="text-[13px] text-mute">{howOf(n.id)}</span>
                        </span>
                        <Icon name="chevron-right" size={18} className="text-edge" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 border-t border-line bg-white px-5 py-3 md:hidden">
        {released ? (
          <a
            href={`/go/${app.id}`}
            className="flex min-h-[52px] items-center justify-center rounded-full bg-salmon text-base font-bold text-white no-underline hover:bg-salmon-dark hover:text-white"
          >
            免費下載{app.name}
          </a>
        ) : (
          <span
            role="status"
            className="flex min-h-[52px] items-center justify-center rounded-full bg-soft text-base font-bold text-mute"
          >
            {app.name}即將上架
          </span>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
