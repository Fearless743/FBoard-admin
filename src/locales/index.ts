export const supportedLngs = ["zh-CN", "zh-TW", "en-US", "ru-RU"] as const;
export type AppLanguage = (typeof supportedLngs)[number];

export async function loadLocale(lang: string): Promise<Record<string, any>> {
  const existing = window.FBOARD_TRANSLATIONS?.[lang];
  if (existing) return existing;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `/locales/${lang}.js`;
    script.onload = () => {
      const T = window.FBOARD_TRANSLATIONS || {};
      resolve(T[lang] || {});
    };
    script.onerror = () => resolve({});
    document.head.appendChild(script);
  });
}
