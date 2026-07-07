export const supportedLngs = ["zh-CN", "en-US", "ru-RU"] as const;
export type AppLanguage = (typeof supportedLngs)[number];

export async function loadLocale(lang: string): Promise<Record<string, any>> {
  const existing = (window as any).XBOARD_TRANSLATIONS?.[lang];
  if (existing) return existing;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `/locales/${lang}.js`;
    script.onload = () => {
      const T = (window as any).XBOARD_TRANSLATIONS || {};
      resolve(T[lang] || {});
    };
    script.onerror = () => resolve({});
    document.head.appendChild(script);
  });
}
