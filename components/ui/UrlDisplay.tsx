import { ExternalLink } from "lucide-react";

export function UrlDisplay({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 text-sm truncate hover:underline"
    >
      {url.replace(/^https?:\/\//, "")}
      <ExternalLink size={13} className="shrink-0" />
    </a>
  );
}
