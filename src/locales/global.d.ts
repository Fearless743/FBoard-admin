/**
 * 全局窗口类型增强 + locale 资源类型。
 * src/locales/<lang>.ts 通过 import type { Translations } 复用本类型，
 * 同时为运行时通过 <script> 注入的 window.FBOARD_TRANSLATIONS 提供类型。
 */
export type TranslationLeaf = string | number | boolean | null;
export type TranslationNode =
  | TranslationLeaf
  | { [key: string]: TranslationNode }
  | TranslationNode[];
export type Translations = Record<string, TranslationNode>;

export {};

declare global {
  interface Window {
    FBOARD_TRANSLATIONS?: Record<string, Translations>;
  }
}
