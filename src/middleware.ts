import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory counter for demo purposes; replace with durable store in prod
const hits = new Map<string, { count: number; ts: number }>();

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Basic CSP (looser in dev to support Next.js HMR and bundler eval)
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = ["'self'", "'unsafe-inline'", "https://giscus.app"];
  if (isDev) scriptSrc.push("'unsafe-eval'");
  const connectSrc = [
    "'self'",
    "http://localhost:1337",
    "http://127.0.0.1:1337",
    "https://giscus.app",
    "https://api.github.com",
    "ws:",
    "wss:",
  ];
  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    "http://localhost:1337",
    "http://127.0.0.1:1337",
    "https://avatars.githubusercontent.com",
  ];
  const styleSrc = ["'self'", "'unsafe-inline'"];
  const frameSrc = ["https://giscus.app"];

  const csp = [
    `default-src 'self'`,
    `img-src ${imgSrc.join(" ")}`,
    `script-src ${scriptSrc.join(" ")}`,
    `style-src ${styleSrc.join(" ")}`,
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src ${frameSrc.join(" ")}`,
  ].join("; ");
  res.headers.set("Content-Security-Policy", csp);

  // Basic per-IP rate limit (burst 60/min)
  const ip =
    req.headers.get("x-real-ip") ||
  req.headers.get("x-forwarded-for") ||
    "local";
  const key = `${ip}`;
  const now = Date.now();
  const windowMs = 60_000;
  const prev = hits.get(key);
  if (!prev || now - prev.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
  } else {
    prev.count += 1;
    if (prev.count > 60) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
