import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "node:fs";
import { transform } from "esbuild";

const localesSrc = path.resolve(__dirname, "src/locales");

// outDir 解析规则：
// - 本地开发：admin 与 Fboard 平级，产物走 "../Fboard/public/assets/admin"
// - CI（admin 作为 Fboard 子目录被 checkout）：产物走 "../public/assets/admin"
//
// 通过 FBOARD_PUBLIC_ASSETS_DIR 环境变量强制指定产物根目录，未设置时
// 走默认 "../Fboard/public/assets/admin"（与本地布局一致）。CI 在
// .github/workflows 中显式 export 该变量。
const assetsRoot =
  process.env.FBOARD_PUBLIC_ASSETS_DIR ||
  path.resolve(__dirname, "../Fboard/public/assets/admin");
const localesDest = path.resolve(assetsRoot, "locales");

/**
 * 把 src/locales/<lang>.ts 编译回 <lang>.js 写入 PHP 端静态目录。
 *
 * 译注：locale 文件不是 ES 模块，它们是带副作用的脚本，浏览器通过
 *       <script src="/locales/${lang}.js"> 加载并把数据挂到
 *       window.FBOARD_TRANSLATIONS 上。因此输出必须是可在 <script> 中
 *       直接执行的 JS，不能依赖 ESM。
 */
function copyLocales() {
  return {
    name: "copy-locales",
    async closeBundle() {
      fs.mkdirSync(localesDest, { recursive: true });
      // 只处理形如 <lang>-<region>.ts 的语言资源脚本；
      // src/locales/index.ts 是真正的 ES 模块（提供 loadLocale / supportedLngs），
      // 不能被当成 runtime <script> 处理。
      const localeTagPattern = /^[a-z]{2,3}(-[A-Z]{2})?\.ts$/;
      for (const f of fs.readdirSync(localesSrc)) {
        if (!localeTagPattern.test(f)) continue;
        const srcPath = path.join(localesSrc, f);
        const outName = f.replace(/\.ts$/, ".js");
        const outPath = path.join(localesDest, outName);
        const source = fs.readFileSync(srcPath, "utf8");
        const { code } = await transform(source, {
          loader: "ts",
          target: "es2020",
          // IIFE 包一层：保证顶层声明不污染全局；副作用（写 window）仍会执行
          format: "iife",
        });
        fs.writeFileSync(outPath, code);
      }
    },
  };
}

export default defineConfig({
  base: "/assets/admin/",
  plugins: [react(), copyLocales()],
  build: {
    outDir: assetsRoot,
    emptyOutDir: true,
    manifest: true,
    minify: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
