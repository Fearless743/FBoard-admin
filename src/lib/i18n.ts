import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { supportedLngs, loadLocale } from "@/locales";

async function detectAndLoad() {
  const detector = new LanguageDetector();
  detector.init({
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
    lookupLocalStorage: "xboard-admin-lang",
  });

  const detected = (detector.detect?.() as string) || navigator.language;
  const lang = supportedLngs.includes(detected as any) ? detected : "zh-CN";

  try {
    const translations = await loadLocale(lang);

    await i18n
      .use(initReactI18next)
      .init({
        resources: {
          [lang]: { translation: translations },
        },
        fallbackLng: "zh-CN",
        supportedLngs: [...supportedLngs],
        interpolation: { escapeValue: false },
        returnNull: false,
        lng: lang,
      });
  } catch (e) {
    console.error("i18n init failed:", e);
  }

  i18n.on("languageChanged", async (lng) => {
    try {
      const t = await loadLocale(lng);
      i18n.addResourceBundle(lng, "translation", t);
      i18n.changeLanguage(lng);
    } catch (e) {
      console.error("Failed to load locale:", lng, e);
    }
  });
}

detectAndLoad();

export default i18n;
