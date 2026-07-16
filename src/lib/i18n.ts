import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { supportedLngs, loadLocale } from "@/locales";

const loadedLngs = new Set<string>();
const loadingLngs = new Set<string>();

async function detectAndLoad() {
  const detector = new LanguageDetector();
  detector.init({
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
    lookupLocalStorage: "fboard-admin-lang",
  });

  const detected = (detector.detect?.() as string) || navigator.language;
  const lang = supportedLngs.includes(detected as any) ? detected : "zh-CN";

  try {
    const translations = await loadLocale(lang);
    loadedLngs.add(lang);

    await i18n.use(initReactI18next).init({
      resources: {
        [lang]: { translation: translations },
      },
      fallbackLng: "zh-CN",
      supportedLngs: [...supportedLngs],
      interpolation: { escapeValue: false },
      returnNull: false,
      lng: lang,
      // 未加载语言先回退，避免切换瞬间全是 key
      partialBundledLanguages: true,
    });
  } catch (e) {
    console.error("i18n init failed:", e);
  }

  // 禁止在 languageChanged 里无条件 changeLanguage，否则会死循环卡死
  i18n.on("languageChanged", async (lng) => {
    if (!lng || loadedLngs.has(lng) || loadingLngs.has(lng)) return;
    if (i18n.hasResourceBundle(lng, "translation")) {
      loadedLngs.add(lng);
      return;
    }

    loadingLngs.add(lng);
    try {
      const translations = await loadLocale(lng);
      if (!translations || typeof translations !== "object") {
        throw new Error(`empty locale bundle: ${lng}`);
      }
      i18n.addResourceBundle(lng, "translation", translations, true, true);
      loadedLngs.add(lng);
      // 资源就绪后刷新一次 UI；因已标记 loaded，不会再次进入加载
      if (i18n.language === lng) {
        await i18n.changeLanguage(lng);
      }
    } catch (e) {
      console.error("Failed to load locale:", lng, e);
    } finally {
      loadingLngs.delete(lng);
    }
  });
}

// 模块加载时自动初始化（main.tsx 仅 import 本文件）
void detectAndLoad();

export default i18n;
