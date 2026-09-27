"use client";

import { useEffect } from "react";
import { Logo } from "@/components/Logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
          background: "rgb(10 10 10)",
          color: "rgb(255 255 255)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
        }}
      >
        <Logo className="h-10 w-10" />
        <p
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            color: "rgb(154 154 154)",
            letterSpacing: "0.05em",
            marginBottom: 12,
          }}
        >
          CRITICAL ERROR
        </p>

        <h1
          style={{
            fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
            fontSize: 32,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 480,
            margin: 0,
          }}
        >
          Metaviewer hit a wall
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "rgb(154 154 154)",
            lineHeight: 1.6,
            marginTop: 16,
            maxWidth: 380,
          }}
        >
          Something went wrong at the application level. Reloading usually
          fixes it.
        </p>

        {error.digest && (
          <p
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: "rgba(154,154,154,0.7)",
              marginTop: 12,
            }}
          >
            Reference: {error.digest}
          </p>
        )}

        <button
          onClick={() => reset()}
          style={{
            marginTop: 36,
            height: 40,
            padding: "0 20px",
            borderRadius: 6,
            border: "none",
            background: "rgb(240 178 122)",
            color: "rgb(10 10 10)",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Reload app
        </button>
      </body>
    </html>
  );
}
