import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * URL query 字段定义。
 * - 默认值不会写入地址栏（保持链接干净）
 * - string + debounce：输入即时反映到 state，防抖后再写入 URL
 * - 非 page/pageSize 字段变更时，若 schema 含 page，自动回到第 1 页
 */
export type ParamDef =
  | {
      type: "string";
      default?: string;
      /** 防抖毫秒；仅 string 支持。写入 URL / 触发查询用 committed 值 */
      debounce?: number;
      /** 变更时是否重置 page。默认：非 page/pageSize 为 true */
      resetPageOnChange?: boolean;
    }
  | {
      type: "number";
      default?: number;
      min?: number;
      max?: number;
      resetPageOnChange?: boolean;
    }
  | {
      type: "enum";
      values: readonly string[];
      default: string;
      resetPageOnChange?: boolean;
    };

type InferredValue<D extends ParamDef> = D extends { type: "number" }
  ? number
  : string;

export type InferredState<S extends Record<string, ParamDef>> = {
  [K in keyof S]: InferredValue<S[K]>;
};

function defaultOf(def: ParamDef): string | number {
  if (def.type === "number") return def.default ?? 0;
  if (def.type === "enum") return def.default;
  return def.default ?? "";
}

function parseValue(def: ParamDef, raw: string | null): string | number {
  if (def.type === "number") {
    const fallback = def.default ?? 0;
    if (raw == null || raw === "") return fallback;
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    let v = Math.trunc(n);
    if (def.min != null && v < def.min) v = def.min;
    if (def.max != null && v > def.max) v = def.max;
    return v;
  }
  if (def.type === "enum") {
    if (raw != null && (def.values as readonly string[]).includes(raw)) {
      return raw;
    }
    return def.default;
  }
  if (raw == null) return def.default ?? "";
  return raw;
}

/** null = 应从 URL 中删除（等于默认） */
function serializeValue(def: ParamDef, value: string | number): string | null {
  if (def.type === "number") {
    const fallback = def.default ?? 0;
    if (value === fallback) return null;
    return String(value);
  }
  if (def.type === "enum") {
    if (value === def.default) return null;
    return String(value);
  }
  const fallback = def.default ?? "";
  if (value === fallback) return null;
  return String(value);
}

function isPageKey(key: string): boolean {
  if (key === "page") return true;
  if (key.endsWith("_page") || key.endsWith("Page")) return true;
  return false;
}

function isPageSizeKey(key: string): boolean {
  if (key === "pageSize" || key === "page_size") return true;
  const lower = key.toLowerCase();
  return lower.endsWith("pagesize") || lower.endsWith("_pagesize") || lower.endsWith("_page_size");
}

function shouldResetPage(key: string, def: ParamDef): boolean {
  // 翻页 / 改每页条数本身不触发 reset
  if (isPageKey(key) || isPageSizeKey(key)) return false;
  if (def.resetPageOnChange === false) return false;
  if (def.resetPageOnChange === true) return true;
  return true;
}

function parseAll<S extends Record<string, ParamDef>>(
  schema: S,
  params: URLSearchParams,
): InferredState<S> {
  const result = {} as InferredState<S>;
  for (const key of Object.keys(schema) as (keyof S & string)[]) {
    result[key] = parseValue(schema[key], params.get(key)) as InferredState<S>[typeof key];
  }
  return result;
}

export type UseUrlStateOptions = {
  /** 默认 true：筛选/翻页不堆浏览器历史 */
  replace?: boolean;
};

/**
 * 将列表筛选/分页与地址栏 query 双向同步（HashRouter 下使用 react-router 的 useSearchParams）。
 *
 * @returns
 * - `state`：UI 绑定值（带 debounce 的 string 为即时 draft）
 * - `setState`：合并 patch；debounce 字段延迟写 URL，其余立即写
 * - `query`：已提交到 URL 的值（请求 / React Query 请用这个）
 */
export function useUrlState<S extends Record<string, ParamDef>>(
  schema: S,
  options?: UseUrlStateOptions,
): [InferredState<S>, (patch: Partial<InferredState<S>>) => void, InferredState<S>] {
  const replace = options?.replace !== false;
  const [searchParams, setSearchParams] = useSearchParams();
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const schemaKeys = Object.keys(schema).join("\0");
  const debouncedKeySet = useMemo(() => {
    const set = new Set<string>();
    for (const key of Object.keys(schema)) {
      const def = schema[key];
      if (def.type === "string" && def.debounce && def.debounce > 0) {
        set.add(key);
      }
    }
    return set;
    // schema 形状以 keys 字符串稳定；def 内容取自 schemaRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaKeys]);

  const committed = useMemo(
    () => parseAll(schemaRef.current, searchParams),
    // searchParams 变化时重读；schema 通过 ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, schemaKeys],
  );

  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const d: Record<string, string> = {};
    for (const key of debouncedKeySet) {
      d[key] = String(parseValue(schema[key], searchParams.get(key)));
    }
    return d;
  });

  // 浏览器前进/后退或外部改 URL 时，把 draft 同步到 committed
  const committedDebouncedSig = useMemo(() => {
    return [...debouncedKeySet]
      .map((k) => `${k}:${String(committed[k as keyof typeof committed] ?? "")}`)
      .join("|");
  }, [committed, debouncedKeySet]);

  useEffect(() => {
    setDrafts((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const key of debouncedKeySet) {
        const v = String(committed[key as keyof typeof committed] ?? "");
        if (next[key] !== v) {
          next[key] = v;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [committedDebouncedSig, debouncedKeySet, committed]);

  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pendingDraftsRef = useRef<Record<string, string>>({});

  const writeToUrl = useCallback(
    (patch: Partial<InferredState<S>>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const sch = schemaRef.current;
          let resetPage = false;

          for (const key of Object.keys(patch) as (keyof S & string)[]) {
            if (!(key in sch)) continue;
            const def = sch[key];
            const value = patch[key] as string | number;
            const serialized = serializeValue(def, value);
            if (serialized == null) next.delete(key);
            else next.set(key, serialized);
            if (shouldResetPage(key, def)) resetPage = true;
          }

          // 筛选变更时重置本 schema 内所有 page 键（page / t_page / c_page…），不含 pageSize
          if (resetPage) {
            for (const pk of Object.keys(sch) as (keyof S & string)[]) {
              if (pk in patch) continue;
              if (!isPageKey(pk) || isPageSizeKey(pk)) continue;
              const pageDef = sch[pk];
              if (pageDef.type !== "number") continue;
              const pageDefault = defaultOf(pageDef);
              const serialized = serializeValue(pageDef, pageDefault);
              if (serialized == null) next.delete(pk);
              else next.set(pk, serialized);
            }
          }

          if (next.toString() === prev.toString()) return prev;
          return next;
        },
        { replace },
      );
    },
    [setSearchParams, replace],
  );

  const setState = useCallback(
    (patch: Partial<InferredState<S>>) => {
      const sch = schemaRef.current;
      const immediate: Partial<InferredState<S>> = {};

      for (const key of Object.keys(patch) as (keyof S & string)[]) {
        if (!(key in sch)) continue;
        const def = sch[key];
        const value = patch[key] as string | number;

        if (def.type === "string" && def.debounce && def.debounce > 0) {
          const strVal = String(value ?? "");
          setDrafts((d) => (d[key] === strVal ? d : { ...d, [key]: strVal }));
          pendingDraftsRef.current[key] = strVal;
          if (timersRef.current[key]) clearTimeout(timersRef.current[key]);
          const delay = def.debounce;
          timersRef.current[key] = setTimeout(() => {
            const v = pendingDraftsRef.current[key];
            delete pendingDraftsRef.current[key];
            writeToUrl({ [key]: v } as Partial<InferredState<S>>);
          }, delay);
        } else {
          (immediate as Record<string, string | number>)[key] = value;
        }
      }

      if (Object.keys(immediate).length > 0) {
        writeToUrl(immediate);
      }
    },
    [writeToUrl],
  );

  useEffect(() => {
    return () => {
      for (const t of Object.values(timersRef.current)) clearTimeout(t);
    };
  }, []);

  const state = useMemo(() => {
    const s = { ...committed };
    for (const key of debouncedKeySet) {
      if (key in drafts) {
        (s as Record<string, string | number>)[key] = drafts[key];
      }
    }
    return s;
  }, [committed, drafts, debouncedKeySet]);

  return [state, setState, committed];
}

/** 常见列表：page + pageSize + 自定义筛选 */
export function listQuerySchema<E extends Record<string, ParamDef>>(
  extras: E,
  opts?: { pageSize?: number },
): {
  page: { type: "number"; default: number; min: number };
  pageSize: { type: "number"; default: number; min: number };
} & E {
  return {
    page: { type: "number", default: 1, min: 1 },
    pageSize: { type: "number", default: opts?.pageSize ?? 20, min: 1 },
    ...extras,
  };
}
