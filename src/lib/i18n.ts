import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { supportedLngs, loadLocale } from "@/locales";

const loadedLngs = new Set<string>();
const loadingLngs = new Set<string>();

/** 读取语言偏好：localStorage（header 语言切换写入）> 浏览器语言 > 默认中文 */
function detectLanguage(): string {
  let detected: string | null = null;
  try {
    detected = localStorage.getItem("fboard-admin-lang");
  } catch {
    /* localStorage 不可用时忽略 */
  }
  detected = detected || navigator.language;
  return supportedLngs.includes(detected as any) ? detected : "zh-CN";
}

const initialLng = detectLanguage();
// 生产环境 blade 会在入口脚本前同步加载 /locales/*.js，这里可直接拿到资源；
// mock / 纯 dev 下为空，再在模块加载后异步拉取。
const preloaded = window.FBOARD_TRANSLATIONS?.[initialLng];

// 关键：必须在首帧渲染前同步注册 i18n 实例。
// react-i18next 在拿不到实例时会提前 return（少调用若干 hooks），
// 实例晚到会让后续渲染的 hooks 数量/顺序发生变化，直接触发
// "change in the order of Hooks" / "prevDeps is undefined" 崩溃。
void i18n.use(initReactI18next).init({
  resources: preloaded ? { [initialLng]: { translation: preloaded } } : {},
  fallbackLng: "zh-CN",
  supportedLngs: [...supportedLngs],
  interpolation: { escapeValue: false },
  returnNull: false,
  lng: initialLng,
  // 未加载语言先回退，避免切换瞬间全是 key
  partialBundledLanguages: true,
});

if (preloaded) loadedLngs.add(initialLng);

// 禁止在 languageChanged 里无条件 changeLanguage，否则会死循环卡死
i18n.on("languageChanged", async (lng) => {
  if (!lng || loadedLngs.has(lng) || loadingLngs.has(lng)) return;

  // 注意：不能用 hasResourceBundle 判断语言是否已加载 —— 插件翻译合并会先给
  // 未加载的语言塞入部分 bundle，据此提前返回会导致切换语言时缺少主体翻译。
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

// 首屏语言资源异步补齐；实例已同步注册，不会影响 hooks 稳定性
async function loadInitialLocale() {
  if (loadedLngs.has(initialLng)) return;

  loadingLngs.add(initialLng);
  try {
    const translations = await loadLocale(initialLng);
    i18n.addResourceBundle(initialLng, "translation", translations ?? {}, true, true);
    loadedLngs.add(initialLng);
    if (i18n.language === initialLng) {
      await i18n.changeLanguage(initialLng);
    }
  } catch (e) {
    console.error("i18n init failed:", e);
  } finally {
    loadingLngs.delete(initialLng);
  }
}

// 模块加载时自动初始化（main.tsx 仅 import 本文件）
void loadInitialLocale();

export default i18n;
