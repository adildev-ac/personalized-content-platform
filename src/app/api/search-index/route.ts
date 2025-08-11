import { NextResponse } from "next/server";
import { getArticleIndex } from "@/lib/api";

export const revalidate = 300;

export async function GET() {
  const json = await getArticleIndex();
  return NextResponse.json(json, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
