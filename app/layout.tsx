import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Metaviewer - Your link previews are broken. Find out why.",
  description:
    "Analyze your website's Open Graph tags, Twitter Cards, and meta tags. See exactly how your links preview on Google, X, LinkedIn, Discord, Slack, WhatsApp, Telegram, Facebook, and iMessage.",
};

// Runs before paint to avoid a flash of the wrong theme. Reads the same
// localStorage key that lib/localHistory.ts writes to.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("metaviewer:theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-background text-fg font-sans antialiased min-h-screen transition-colors">
        {children}
      </body>
    </html>
  );
}
