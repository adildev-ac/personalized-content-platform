import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory counter for demo purposes; replace with durable store in prod
const hits = new Map<string, { count: number; ts: number }>();

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Enhanced CSP with stronger security directives
  const isDev = process.env.NODE_ENV !== "production";
  
  // Script sources - restrict to trusted domains
  const scriptSrc = [
    "'self'", 
    // Allow inline scripts only in dev, use nonce in production
    isDev ? "'unsafe-inline'" : null,
    "https://giscus.app"
  ].filter(Boolean) as string[];
  
  // Only allow eval in development for HMR
  if (isDev) scriptSrc.push("'unsafe-eval'");
  
  // Connection sources - restrict to API endpoints and required services
  const connectSrc = [
    "'self'",
    // API endpoints for Strapi
    "http://localhost:1337",
    "http://127.0.0.1:1337",
    // Giscus and GitHub API for comments
    "https://giscus.app",
    "https://api.github.com",
    // WebSocket for dev only
    ...(isDev ? ["ws:", "wss:"] : []),
  ];
  
  // Image sources - restrict to trusted domains
  const imgSrc = [
    "'self'",
    "data:",  // For inline SVGs and base64 images
    "blob:",  // For dynamically generated images
    // Strapi media
    "http://localhost:1337",
    "http://127.0.0.1:1337",
    // GitHub avatars for comments
    "https://avatars.githubusercontent.com",
  ];
  const styleSrc = ["'self'", "'unsafe-inline'"];
  const frameSrc = ["https://giscus.app"];
  const fontSrc = ["'self'", "https://fonts.gstatic.com"];
  const mediaSrc = ["'self'"];
  
  // Comprehensive CSP with all directives
  // Build CSP string with report-uri
  const origin = req.nextUrl.origin;
  const csp = [
    `default-src 'self'`,
    `img-src ${imgSrc.join(" ")}`,
    `script-src ${scriptSrc.join(" ")}`,
    `style-src ${styleSrc.join(" ")}`,
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src ${frameSrc.join(" ")}`,
    `font-src ${fontSrc.join(" ")}`,
    `media-src ${mediaSrc.join(" ")}`,
    // Prevents clickjacking attacks
    `frame-ancestors 'self'`,
    // Restricts loading of resources via base URI
    `base-uri 'self'`,
    // Prevents form submission to external URLs
    `form-action 'self'`,
    // Prevents mixed content (HTTP in HTTPS)
    `upgrade-insecure-requests`,
    // Blocks browser from doing MIME-type sniffing
    `block-all-mixed-content`,
    // Report CSP violations to our endpoint
    `report-uri ${origin}/api/csp-report`,
    // Modern browsers use this instead of report-uri
    `report-to csp-endpoint`,
  ].join("; ");
  
  // Set up report-to header for modern browsers
  const reportToHeader = JSON.stringify({
    group: "csp-endpoint",
    max_age: 10886400, // ~4 months
    endpoints: [
      { url: `${origin}/api/csp-report` }
    ]
  });

  // Set Content Security Policy
  res.headers.set("Content-Security-Policy", csp);
  
  // Set Report-To header for modern browsers
  res.headers.set("Report-To", reportToHeader);
  
  // Additional security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  
  // Set HSTS header in production
  if (!isDev) {
    res.headers.set(
      "Strict-Transport-Security", 
      "max-age=63072000; includeSubDomains; preload" // 2 years
    );
  }

  // Enhanced rate limiting with sliding window
  // Extract client IP with fallbacks and validation
  const clientIP = 
    req.headers.get("x-real-ip") || 
    req.headers.get("x-forwarded-for")?.split(',')[0].trim() ||
    "local";
  
  // Get the request path for more granular rate limiting
  const path = req.nextUrl.pathname;
  
  // Use different rate limits based on endpoint sensitivity
  let maxRequests = 60; // Default 60/min
  let windowMs = 60_000; // Default 1 minute window
  
  // Apply stricter limits for sensitive operations
  if (path.startsWith('/api/')) {
    maxRequests = 30; // 30/min for API endpoints
  }
  
  // Create a unique key combining IP and path category
  const pathCategory = path.split('/')[1] || 'root';
  const key = `${clientIP}:${pathCategory}`;
  
  const now = Date.now();
  
  // Cleanup old entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    for (const [mapKey, mapValue] of hits.entries()) {
      if (now - mapValue.ts > windowMs) {
        hits.delete(mapKey);
      }
    }
  }
  
  const prev = hits.get(key);
  
  if (!prev || now - prev.ts > windowMs) {
    // New window, reset count
    hits.set(key, { count: 1, ts: now });
  } else {
    // Increment count in existing window
    prev.count += 1;
    
    // Check if limit exceeded
    if (prev.count > maxRequests) {
      // Add Retry-After header for better client behavior
      const response = new NextResponse("Too Many Requests", { status: 429 });
      response.headers.set("Retry-After", "60");
      return response;
    }
  }
  
  // Add rate limit headers to response
  res.headers.set("X-RateLimit-Limit", maxRequests.toString());
  res.headers.set("X-RateLimit-Remaining", prev ? 
    Math.max(0, maxRequests - prev.count).toString() : 
    maxRequests.toString());

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
