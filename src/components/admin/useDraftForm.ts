"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Stored<T> = { values: T; savedAt: number };

function read<T>(key: string): Stored<T> | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Stored<T>) : null;
  } catch {
    return null;
  }
}

/**
 * Form state with:
 * - dirty tracking against the last saved values
 * - autosave of unsaved changes to this device (localStorage), restorable later
 * - a browser warning when leaving with unsaved changes
 */
export function useDraftForm<T extends Record<string, unknown>>(storageKey: string, initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [baseline, setBaseline] = useState<string>(() => JSON.stringify(initial));
  const [autosavedAt, setAutosavedAt] = useState<number | null>(null);
  const [restorable, setRestorable] = useState<Stored<T> | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = read<T>(storageKey);
    return stored && JSON.stringify(stored.values) !== JSON.stringify(initial) ? stored : null;
  });
  const timer = useRef<number | undefined>(undefined);

  const dirty = useMemo(() => JSON.stringify(values) !== baseline, [values, baseline]);

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
  }, []);

  // Debounced autosave of unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        const savedAt = Date.now();
        localStorage.setItem(storageKey, JSON.stringify({ values, savedAt }));
        setAutosavedAt(savedAt);
      } catch {
        // Storage unavailable (private mode); autosave is a convenience only.
      }
    }, 800);
    return () => window.clearTimeout(timer.current);
  }, [values, dirty, storageKey]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const clearLocal = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setAutosavedAt(null);
  }, [storageKey]);

  /** Call after a successful save to the database. */
  const markSaved = useCallback(
    (saved: T) => {
      setValues(saved);
      setBaseline(JSON.stringify(saved));
      clearLocal();
    },
    [clearLocal],
  );

  const restore = useCallback(() => {
    if (restorable) setValues(restorable.values);
    setRestorable(null);
  }, [restorable]);

  const discardRestorable = useCallback(() => {
    clearLocal();
    setRestorable(null);
  }, [clearLocal]);

  return { values, set, setValues, dirty, autosavedAt, markSaved, clearLocal, restorable, restore, discardRestorable };
}
