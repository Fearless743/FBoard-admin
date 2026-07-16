import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "node:fs";
import { transform } from "esbuild";

const localesSrc = path.resolve(__dirname, "src/locales");
const localesDest = path.resolve(
  __dirname,
  "../Fboard/public/assets/admin/locales",
);

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
    outDir: path.resolve(__dirname, "../Fboard/public/assets/admin"),
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
