import { NextRequest, NextResponse } from "next/server";

const FLICKR_BASE = "https://api.flickr.com/services/rest/";
const FIXED_PARAMS = {
  method: "flickr.photos.search",
  format: "json",
  nojsoncallback: "1",
  content_type: "1",
  extras: "url_l,url_m,url_w,owner_name,title,date_taken",
} as const;

const FORWARDED_PARAMS = [
  "tags",
  "tag_mode",
  "safe_search",
  "sort",
  "page",
  "per_page",
  "min_taken_date",
  "max_taken_date",
] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const apiKey = process.env.FLICKR_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { stat: "fail", message: "FLICKR_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(FIXED_PARAMS)) {
    params.set(key, value);
  }
  params.set("api_key", apiKey);

  for (const key of FORWARDED_PARAMS) {
    const value = searchParams.get(key);
    if (value !== null && value !== "") {
      params.set(key, value);
    }
  }

  const url = `${FLICKR_BASE}?${params.toString()}`;

  try {
    const response = await fetch(url, { next: { revalidate: 0 } });
    if (!response.ok) {
      return NextResponse.json(
        { stat: "fail", message: `Flickr returned HTTP ${response.status}` },
        { status: 502 },
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { stat: "fail", message: "Failed to reach Flickr API" },
      { status: 502 },
    );
  }
}
