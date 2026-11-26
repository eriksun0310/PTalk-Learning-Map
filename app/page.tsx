import { AboutBlock } from "@/components/AboutBlock";
import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { siteJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={siteJsonLd()} />
      <HomePage />
      <AboutBlock />
      <SiteFooter full />
    </>
  );
}
