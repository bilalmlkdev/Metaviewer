"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const GAP = 8;
const FLIP_THRESHOLD = 44;

export function Tooltip({
  label,
  children,
  side = "top",
}: {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const [actualSide, setActualSide] = useState<"top" | "bottom">(side);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  function show() {
    const el = triggerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (side === "top" && rect.top - GAP < FLIP_THRESHOLD) {
        setActualSide("bottom");
      } else if (
        side === "bottom" &&
        window.innerHeight - rect.bottom - GAP < FLIP_THRESHOLD
      ) {
        setActualSide("top");
      } else {
        setActualSide(side);
      }
    }
    setOpen(true);
  }

  function hide() {
    setOpen(false);
  }

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, x: "-50%", y: actualSide === "top" ? 4 : -4, scale: 0.96 }}
            animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
            exit={{ opacity: 0, x: "-50%", y: actualSide === "top" ? 4 : -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className={clsx(
              "pointer-events-none absolute left-1/2 whitespace-nowrap",
              "rounded-lg bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 text-zinc-100",
              "px-2.5 py-1.5 text-xs font-medium shadow-md z-50",
              actualSide === "top" ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {label}
            <span
              className={clsx(
                "absolute left-1/2 -translate-x-1/2 w-0 h-0",
                actualSide === "top"
                  ? "top-full border-x-4 border-x-transparent border-t-4 border-t-zinc-800 dark:border-t-zinc-100"
                  : "bottom-full border-x-4 border-x-transparent border-b-4 border-b-zinc-800 dark:border-b-zinc-100"
              )}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
