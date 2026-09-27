import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { RouteLoader } from "@/components/RouteLoader";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
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
    var theme = stored === "light" ? "light" : "dark";
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
        className={`dark ${dmSans.variable} ${instrumentSerif.variable}`}
        suppressHydrationWarning
      >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-background text-fg font-sans antialiased min-h-screen transition-colors">
        <RouteLoader />
        {children}
      </body>
    </html>
  );
}
