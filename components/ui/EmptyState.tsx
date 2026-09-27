import { Logo } from "@/components/Logo";
import Link from "next/link";

export function EmptyHistory() {
  return (
    <div className="text-center py-24 text-muted">
      <Logo className="h-12 w-12 mx-auto mb-5 text-border" />
      <p className="mb-4">
        No checks yet. Everything you analyze is saved here, in your
        browser only.
      </p>
      <Link href="/" className="text-accent hover:underline text-sm">
        Run your first check
      </Link>
    </div>
  );
}
