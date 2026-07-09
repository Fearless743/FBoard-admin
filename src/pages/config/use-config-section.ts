import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveConfig } from "@/api/config";
import type { SectionDef } from "./schema";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseConfigSectionOptions {
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export function useConfigSection(
  section: SectionDef,
  initial: Record<string, unknown> | undefined,
  options: UseConfigSectionOptions = {},
) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { autoSave = false, autoSaveDelay = 800 } = options;

  const initialValues = useMemo(() => {
    const v: Record<string, unknown> = {};
    if (initial) {
      for (const f of section.fields) v[f.key] = initial[f.key];
    }
    return v;
  }, [initial, section.fields]);

  const [draft, setDraft] = useState<Record<string, unknown>>(initialValues);
  const [baseline, setBaseline] = useState<Record<string, unknown>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetFromServer = useCallback(
    (next: Record<string, unknown> | undefined) => {
      if (!next) return;
      const v: Record<string, unknown> = {};
      for (const f of section.fields) v[f.key] = next[f.key];
      setDraft(v);
      setBaseline(v);
    },
    [section.fields],
  );

  const dirty = useMemo(() => {
    return section.fields.some((f) => !isEqual(draft[f.key], baseline[f.key]));
  }, [draft, baseline, section.fields]);

  const set = useCallback((key: string, value: unknown) => {
    setDraft((s) => ({ ...s, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setDraft(baseline);
  }, [baseline]);

  const performSave = useCallback(
    async (override?: Record<string, unknown>) => {
      if (saving) return;
      const changed: Record<string, unknown> = override ?? {};
      if (!override) {
        for (const f of section.fields) {
          if (!isEqual(draft[f.key], baseline[f.key])) {
            changed[f.key] = draft[f.key];
          }
        }
      }
      if (Object.keys(changed).length === 0) return;
      setSaving(true);
      setError(null);
      try {
        await saveConfig(changed);
        qc.setQueryData(["config", section.key], (old: any) => ({
          ...(old ?? {}),
          ...changed,
        }));
        const next = { ...baseline, ...changed };
        setBaseline(next);
        setDraft(next);
        setSavedAt(Date.now());
        if (!autoSave) {
          toast.success(t("settings.common.save_success"));
        }
      } catch (e: any) {
        setError(e?.message ?? "error");
        if (!autoSave) {
          toast.error(t("settings.common.save_error"));
        } else {
          toast.error(t("settings.common.save_error"));
        }
      } finally {
        setSaving(false);
      }
    },
    [autoSave, baseline, dirty, draft, qc, saving, section, t],
  );

  const save = useCallback(() => performSave(), [performSave]);

  const saveField = useCallback(
    async (key: string, value: unknown) => {
      if (isEqual(baseline[key], value)) return;
      await performSave({ [key]: value });
    },
    [baseline, performSave],
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!autoSave) return;
    if (!dirty) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      performSave();
    }, autoSaveDelay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoSave, autoSaveDelay, dirty, draft, performSave]);

  const status: SaveStatus = saving ? "saving" : error ? "error" : savedAt && !dirty ? "saved" : "idle";

  return {
    values: draft,
    set,
    dirty,
    saving,
    savedAt,
    error,
    status,
    save,
    saveField,
    reset,
    resetFromServer,
  };
}

function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a === "string" && typeof b === "string") return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  if (typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object);
    const bk = Object.keys(b as object);
    if (ak.length !== bk.length) return false;
    for (const k of ak) {
      if (!isEqual((a as any)[k], (b as any)[k])) return false;
    }
    return true;
  }
  return false;
}