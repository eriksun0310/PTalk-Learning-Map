import { NextResponse, type NextRequest } from "next/server";
import { androidUrl, iosUrl, isReleased } from "@/data/stores";
import { getApp } from "@/lib/apps";
import { detectPlatform } from "@/lib/platform";

/** /go/<id>：依裝置轉到對應商店；其他裝置回該 App 的介紹頁 */
export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!getApp(id)) return NextResponse.redirect(new URL("/", request.url), 302);

  const platform = detectPlatform(request.headers.get("user-agent") ?? "");
  const store =
    !isReleased(id) ? null : platform === "ios" ? iosUrl(id) : platform === "android" ? androidUrl(id) : null;

  const res = NextResponse.redirect(store ?? new URL(`/apps/${id}`, request.url), 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Vary", "User-Agent");
  return res;
}
