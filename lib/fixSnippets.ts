import type { AnalysisResult, ExtractedMeta } from "@/types";

export type SnippetFramework = "html" | "nextjs" | "astro" | "hugo";

function domainOf(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

interface Tag {
  title: string;
  description: string;
  canonical: string;
  themeColor: string;
  ogImage: string;
  twitterCard: string;
  siteName: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJs(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

function resolveTags(meta: ExtractedMeta): Tag {
  const origin = domainOf(meta.finalUrl);
  return {
    title: meta.title ?? "Your page title here",
    description: meta.description ?? "A concise, compelling description of this page (under 160 characters).",
    canonical: meta.canonical ?? meta.finalUrl,
    themeColor: meta.themeColor ?? "#0a0a0a",
    ogImage: meta.og["og:image"] ?? `${origin}/og-image.png`,
    twitterCard: meta.twitter["twitter:card"] ?? "summary_large_image",
    siteName: meta.og["og:site_name"] ?? "",
  };
}

export function generateSnippet(result: AnalysisResult, framework: SnippetFramework): string {
  const t = resolveTags(result.meta);

  if (framework === "html") {
    const e = {
      title: escapeHtml(t.title),
      description: escapeHtml(t.description),
      canonical: escapeHtml(t.canonical),
      themeColor: escapeHtml(t.themeColor),
      ogImage: escapeHtml(t.ogImage),
      twitterCard: escapeHtml(t.twitterCard),
      siteName: escapeHtml(t.siteName),
    };
    return `<title>${e.title}</title>
<meta name="description" content="${e.description}" />
<link rel="canonical" href="${e.canonical}" />
<meta name="theme-color" content="${e.themeColor}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${e.title}" />
<meta property="og:description" content="${e.description}" />
<meta property="og:image" content="${e.ogImage}" />
<meta property="og:url" content="${e.canonical}" />${e.siteName ? `\n<meta property="og:site_name" content="${e.siteName}" />` : ""}

<!-- Twitter Card -->
<meta name="twitter:card" content="${e.twitterCard}" />
<meta name="twitter:title" content="${e.title}" />
<meta name="twitter:description" content="${e.description}" />
<meta name="twitter:image" content="${e.ogImage}" />`;
  }

  if (framework === "nextjs") {
    const e = {
      title: escapeJs(t.title),
      description: escapeJs(t.description),
      canonical: escapeJs(t.canonical),
      themeColor: escapeJs(t.themeColor),
      ogImage: escapeJs(t.ogImage),
      twitterCard: escapeJs(t.twitterCard),
      siteName: escapeJs(t.siteName),
    };
    return `// app/layout.tsx or app/page.tsx (App Router)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${e.title}",
  description: "${e.description}",
  alternates: {
    canonical: "${e.canonical}",
  },
  themeColor: "${e.themeColor}",
  openGraph: {
    type: "website",
    title: "${e.title}",
    description: "${e.description}",
    url: "${e.canonical}",
    images: ["${e.ogImage}"],${e.siteName ? `\n    siteName: "${e.siteName}",` : ""}
  },
  twitter: {
    card: "${e.twitterCard}",
    title: "${e.title}",
    description: "${e.description}",
    images: ["${e.ogImage}"],
  },
};`;
  }

  if (framework === "astro") {
    const e = {
      title: escapeJs(t.title),
      description: escapeJs(t.description),
      canonical: escapeJs(t.canonical),
      ogImage: escapeJs(t.ogImage),
      themeColor: escapeHtml(t.themeColor),
      twitterCard: escapeHtml(t.twitterCard),
    };
    return `---
// src/layouts/BaseLayout.astro (frontmatter)
const title = "${e.title}";
const description = "${e.description}";
const canonical = "${e.canonical}";
const ogImage = "${e.ogImage}";
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta name="theme-color" content="${e.themeColor}" />

<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:url" content={canonical} />

<meta name="twitter:card" content="${e.twitterCard}" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />`;
  }

  // hugo
  return `<!-- layouts/partials/head.html -->
<title>{{ .Title }}</title>
<meta name="description" content="{{ .Description }}">
<link rel="canonical" href="{{ .Permalink }}">
<meta name="theme-color" content="{{ "${t.themeColor}" }}">

<meta property="og:type" content="website">
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="{{ .Description }}">
<meta property="og:image" content="{{ .Permalink }}">
<meta property="og:url" content="{{ .Permalink }}">

<meta name="twitter:card" content="{{ "${t.twitterCard}" }}">
<meta name="twitter:title" content="{{ .Title }}">
<meta name="twitter:description" content="{{ .Description }}">
<meta name="twitter:image" content="{{ .Permalink }}">`;
}
