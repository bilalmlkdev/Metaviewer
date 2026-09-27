import { timeAgo } from "@/lib/timeAgo";

export function TimeAgo({ date }: { date: string }) {
  return (
    <span className="text-[10px] text-muted/40 tabular-nums">
      {timeAgo(date)}
    </span>
  );
}
