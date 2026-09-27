"use client";

import { useState, useEffect, useCallback } from "react";
import { getHistory, removeFromHistory, clearHistory, type HistoryEntry } from "@/lib/localHistory";

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  function refresh() {
    setEntries(getHistory().slice(0, 8));
    setLoaded(true);
  }

  function remove(id: string) {
    removeFromHistory(id);
    setEntries((prev) => prev.filter((h) => h.id !== id));
  }

  function clearAll() {
    clearHistory();
    setEntries([]);
  }

  useEffect(() => {
    refresh();
  }, []);

  return { entries, loaded, refresh, remove, clearAll };
}

export function useHistoryAll() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  function refresh() {
    setEntries(getHistory());
    setLoaded(true);
  }

  function remove(id: string) {
    removeFromHistory(id);
    setEntries((prev) => prev.filter((h) => h.id !== id));
  }

  function clearAll() {
    clearHistory();
    setEntries([]);
  }

  useEffect(() => {
    refresh();
  }, []);

  return { entries, loaded, refresh, remove, clearAll };
}
