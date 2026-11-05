export function SiteFooter({ full = false }: { full?: boolean }) {
  return (
    <footer className="on-dark mt-auto bg-ink text-white">
      <div
        className={`mx-auto flex max-w-[1200px] flex-wrap justify-between gap-4 px-5 text-ontone md:px-10 ${
          full ? "py-8 text-sm md:py-14 md:text-[15px]" : "py-7 text-[13px] md:py-10 md:text-sm"
        }`}
      >
        <div className="flex flex-col gap-2">
          <span className="text-[20px] font-black text-white md:text-[22px]">PTalk</span>
          {full && <span className="hidden md:inline">一天幾分鐘，把語言學起來。</span>}
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <a href="mailto:connect.ptalk@gmail.com" className="text-ontone hover:text-white">
            connect.ptalk@gmail.com
          </a>
          <span>Threads @ptalk.design</span>
        </div>
      </div>
    </footer>
  );
}
