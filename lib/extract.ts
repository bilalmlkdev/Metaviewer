import * as cheerio from "cheerio";
import type {
  ExtractedMeta,
  ImageInfo,
  RawTag,
  RobotsTxtInfo,
  SitemapInfo,
  StructuredDataInfo,
} from "@/types";
import { probeImageDimensions } from "@/lib/imageDimensions";

const USER_AGENT =
  "Mozilla/5.0 (compatible; MetaviewerBot/1.0; +https://metaviewer.app/bot)";

// Enough header bytes to reach the SOF marker in the vast majority of real-world
// JPEGs (which usually front-load EXIF/ICC before the frame header) without
// downloading the whole file.
const IMAGE_PROBE_BYTES = 256 * 1024;

export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

function normalizeUrl(input: string): string {
  let value = input.trim();
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }
  const parsed = new URL(value); // throws if invalid
  return parsed.toString();
}

const MAX_BODY_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_AUX_BYTES = 512 * 1024; // 512 KB for robots.txt / sitemap.xml

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  if (/^127\./.test(h) || h === "0.0.0.0" || h === "::1" || h === "::") return true;
  if (/^10\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true; // link-local / cloud metadata
  if (/^fc00:/i.test(h) || /^fe80:/i.test(h)) return true; // IPv6 ULA / link-local
  return false;
}

function safeFetchText(url: string, timeoutMs: number, maxBytes: number): Promise<string | undefined> {
  return fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { "User-Agent": USER_AGENT },
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const reader = res.body?.getReader();
    if (!reader) return undefined;
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        if (total > maxBytes) {
          reader.cancel();
          return undefined;
        }
        chunks.push(value);
      }
    } catch {
      return undefined;
    }
    const decoder = new TextDecoder();
    return chunks.map((c) => decoder.decode(c, { stream: true })).join("") + decoder.decode();
  }).catch(() => undefined);
}

/**
 * Fetches just enough of an image to determine its real pixel dimensions
 * (via lib/imageDimensions.ts) without downloading the whole file. Falls
 * back gracefully to content-length/content-type only if the server ignores
 * Range requests or the format can't be probed from a partial read.
 */
async function probeImage(url: string): Promise<ImageInfo | undefined> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Range: `bytes=0-${IMAGE_PROBE_BYTES - 1}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok && res.status !== 206) return undefined;

    const contentType = res.headers.get("content-type") ?? undefined;
    const contentRange = res.headers.get("content-range"); // e.g. "bytes 0-262143/512000"
    const totalFromRange = contentRange ? Number(contentRange.split("/")[1]) : undefined;
    const contentLength = res.headers.get("content-length");

    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    const probed = probeImageDimensions(buf);

    const bytes = totalFromRange ?? (contentLength ? Number(contentLength) : buf.length);

    return {
      url,
      width: probed?.width,
      height: probed?.height,
      dimensionsDecoded: !!probed,
      bytes,
      contentType: contentType ?? (probed ? `image/${probed.format}` : undefined),
    };
  } catch {
    return undefined;
  }
}

async function checkRobotsTxt(origin: string): Promise<RobotsTxtInfo> {
  try {
    const text = await safeFetchText(`${origin}/robots.txt`, 6000, MAX_AUX_BYTES);
    if (!text) return { checked: true, found: false, allowsIndexing: true };
    const blocksAll = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*(\r?\n|$)/i.test(text);
    return { checked: true, found: true, allowsIndexing: !blocksAll };
  } catch {
    return { checked: true, found: false, allowsIndexing: true };
  }
}

async function checkSitemap(origin: string): Promise<SitemapInfo> {
  try {
    const text = await safeFetchText(`${origin}/sitemap.xml`, 6000, MAX_AUX_BYTES);
    if (!text) return { checked: true, found: false };
    const matches = text.match(/<loc>/g);
    return { checked: true, found: true, urlCount: matches?.length ?? undefined };
  } catch {
    return { checked: true, found: false };
  }
}

function extractStructuredData($: cheerio.CheerioAPI): StructuredDataInfo {
  const types: string[] = [];
  let found = false;

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw?.trim()) return;
    try {
      const parsed = JSON.parse(raw);
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        const graph = node?.["@graph"] ?? [node];
        for (const item of Array.isArray(graph) ? graph : [graph]) {
          const t = item?.["@type"];
          if (!t) continue;
          found = true;
          const list = Array.isArray(t) ? t : [t];
          for (const name of list) {
            if (typeof name === "string" && !types.includes(name)) types.push(name);
          }
        }
      }
    } catch {
      // Malformed JSON-LD — ignore this block, keep scanning others.
    }
  });

  return { checked: true, found, types };
}

export async function extractMeta(rawUrl: string): Promise<ExtractedMeta> {
  const url = normalizeUrl(rawUrl);
  const parsed = new URL(url);

  if (isPrivateHost(parsed.hostname)) {
    throw new FetchError(
      "Local or private network URLs can't be analyzed. Please use a publicly reachable URL."
    );
  }

  let res: Response;
  const startedAt = Date.now();
  try {
    res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    throw new FetchError(
      `Couldn't reach that URL. It may be down or blocking requests. (${
        (err as Error).message
      })`
    );
  }
  const loadTimeMs = Date.now() - startedAt;

  if (!res.ok) {
    throw new FetchError(`Site responded with HTTP ${res.status}.`);
  }

  // Validate that the final URL after redirects is not targeting a private host
  if (res.url) {
    try {
      const finalParsed = new URL(res.url);
      if (isPrivateHost(finalParsed.hostname)) {
        throw new FetchError(
          "Redirect target points to a private network. Please use a publicly reachable URL."
        );
      }
    } catch (e) {
      if (e instanceof FetchError) throw e;
    }
  }

  // Read response body with size limit to prevent OOM
  const reader = res.body?.getReader();
  if (!reader) throw new FetchError("Empty response body.");
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.length;
      if (totalBytes > MAX_BODY_BYTES) {
        reader.cancel();
        throw new FetchError("Response body exceeds 10 MB limit.");
      }
      chunks.push(value);
    }
  } catch (e) {
    if (e instanceof FetchError) throw e;
    throw new FetchError("Failed to read response body.");
  }
  const decoder = new TextDecoder();
  const html = chunks.map((c) => decoder.decode(c, { stream: true })).join("") + decoder.decode();
  const finalUrl = res.url || url;
  const origin = new URL(finalUrl).origin;
  const $ = cheerio.load(html);

  const getMeta = (selector: string) =>
    $(selector).attr("content")?.trim() || undefined;

  const og: Record<string, string> = Object.create(null);
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr("property");
    const content = $(el).attr("content");
    if (prop && content) og[prop] = content.trim();
  });

  const twitter: Record<string, string> = Object.create(null);
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr("name");
    const content = $(el).attr("content");
    if (name && content) twitter[name] = content.trim();
  });

  const title = $("title").first().text().trim() || undefined;
  const description = getMeta('meta[name="description"]');
  const canonicalHref = $('link[rel="canonical"]').attr("href");
  const canonical = canonicalHref
    ? new URL(canonicalHref, finalUrl).toString()
    : undefined;

  const iconHref =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    "/favicon.ico";
  const favicon = new URL(iconHref, finalUrl).toString();

  const appleTouchIconHref = $('link[rel="apple-touch-icon"]').attr("href");
  const appleTouchIcon = appleTouchIconHref
    ? new URL(appleTouchIconHref, finalUrl).toString()
    : undefined;

  const themeColor = getMeta('meta[name="theme-color"]');
  const robots = getMeta('meta[name="robots"]');
  const lang = $("html").attr("lang")?.trim();
  const viewport = getMeta('meta[name="viewport"]');
  const charset =
    $("meta[charset]").attr("charset") ||
    getMeta('meta[http-equiv="Content-Type"]');
  const author = getMeta('meta[name="author"]');
  const keywords = getMeta('meta[name="keywords"]');
  const generator = getMeta('meta[name="generator"]');

  const ogImageUrl = og["og:image:secure_url"] || og["og:image"];
  const ogImageAbsolute = ogImageUrl ? new URL(ogImageUrl, finalUrl).toString() : undefined;

  const [robotsTxt, sitemap, probedOgImage, probedFavicon, probedAppleTouchIcon] =
    await Promise.all([
      checkRobotsTxt(origin),
      checkSitemap(origin),
      ogImageAbsolute ? probeImage(ogImageAbsolute) : Promise.resolve(undefined),
      probeImage(favicon),
      appleTouchIcon ? probeImage(appleTouchIcon) : Promise.resolve(undefined),
    ]);

  // Prefer real decoded pixel dimensions; fall back to the site's own
  // og:image:width/height declaration if we couldn't decode the bytes.
  let ogImage: ImageInfo | undefined;
  if (ogImageAbsolute) {
    const declaredWidth = og["og:image:width"] ? Number(og["og:image:width"]) : undefined;
    const declaredHeight = og["og:image:height"] ? Number(og["og:image:height"]) : undefined;
    ogImage = {
      url: ogImageAbsolute,
      width: probedOgImage?.width ?? declaredWidth,
      height: probedOgImage?.height ?? declaredHeight,
      dimensionsDecoded: !!probedOgImage?.dimensionsDecoded,
      bytes: probedOgImage?.bytes,
      contentType: probedOgImage?.contentType,
    };
  }

  const structuredData = extractStructuredData($);

  const securityHeaders = {
    hsts: res.headers.has("strict-transport-security"),
    xContentTypeOptions: res.headers.has("x-content-type-options"),
    xFrameOptions: res.headers.has("x-frame-options"),
    csp: res.headers.has("content-security-policy"),
  };

  const rawTags: RawTag[] = [];
  if (title) rawTags.push({ type: "title", name: "title", value: title });
  $("meta").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("http-equiv");
    const charsetAttr = $(el).attr("charset");
    const content = $(el).attr("content");
    if (charsetAttr) {
      rawTags.push({ type: "meta", name: "charset", value: charsetAttr });
      return;
    }
    const property = $(el).attr("property");
    if (name && content) {
      rawTags.push({ type: "meta", name, value: content });
    } else if (property && content && !property.startsWith("og:")) {
      rawTags.push({ type: "meta", name: property, value: content });
    }
  });
  Object.entries(og).forEach(([name, value]) => rawTags.push({ type: "og", name, value }));
  Object.entries(twitter).forEach(([name, value]) => rawTags.push({ type: "twitter", name, value }));
  $("link").each((_, el) => {
    const rel = $(el).attr("rel");
    const href = $(el).attr("href");
    if (rel && href) rawTags.push({ type: "link", name: rel, value: href });
  });

  return {
    url,
    finalUrl,
    title,
    description,
    canonical,
    favicon,
    appleTouchIcon,
    themeColor,
    robots,
    lang,
    viewport,
    charset,
    author,
    keywords,
    generator,
    og,
    twitter,
    ogImage,
    httpStatus: res.status,
    loadTimeMs,
    contentType: res.headers.get("content-type") ?? undefined,
    server: res.headers.get("server") ?? undefined,
    redirected: res.redirected,
    securityHeaders,
    robotsTxt,
    sitemap,
    structuredData,
    faviconInfo: probedFavicon,
    appleTouchIconInfo: probedAppleTouchIcon,
    rawTags,
  };
}
