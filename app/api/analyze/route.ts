import { NextRequest, NextResponse } from "next/server";
import { extractMeta, FetchError } from "@/lib/extract";
import { analyze } from "@/lib/analyzer";
import { generateId } from "@/lib/id";

export const runtime = "nodejs";

const MAX_URL_LENGTH = 2048;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

// Simple in-memory rate limiter (per-IP)
declare global {
  // eslint-disable-next-line no-var
  var __rateLimitMap: Map<string, { count: number; resetAt: number }> | undefined;
}

const rateLimitMap: Map<string, { count: number; resetAt: number }> =
  global.__rateLimitMap ?? new Map<string, { count: number; resetAt: number }>();

if (!global.__rateLimitMap) {
  global.__rateLimitMap = rateLimitMap;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const url = body.url?.trim();
  if (!url) {
    return NextResponse.json({ error: "Please provide a URL to analyze." }, { status: 400 });
  }

  if (url.length > MAX_URL_LENGTH) {
    return NextResponse.json({ error: "URL is too long. Please use a shorter URL." }, { status: 400 });
  }

  try {
    const meta = await extractMeta(url);
    const id = generateId();
    const result = analyze(meta, id);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof FetchError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong analyzing that URL. Please try again." },
      { status: 500 }
    );
  }
}
