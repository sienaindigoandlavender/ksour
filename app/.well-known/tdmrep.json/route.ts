import { LICENSE, USAGE_INFO_PATH } from "@/lib/license";

export const dynamic = "force-static";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org").replace(/\/$/, "");

export function GET() {
  const body = [
    {
      location: "/",
      "tdm-reservation": 1,
      "tdm-policy": `${SITE}${USAGE_INFO_PATH}`,
      "tdm-licence": LICENSE.url,
    },
  ];
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/tdmrep+json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
