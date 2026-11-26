import type { MetadataRoute } from "next";
import { apps } from "@/lib/apps";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...apps.map((a) => ({
      url: `${SITE_URL}/apps/${a.id}`,
      ...(a.updated ? { lastModified: a.updated } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
