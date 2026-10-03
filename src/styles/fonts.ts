/**
 * HarmonyOS Sans SC 的 @font-face 声明体量很大（4 个字重 × 82 个 unicode-range
 * 分片，合计约 540KB），如果跟随首屏 CSS 一起同步加载会阻塞渲染。
 *
 * 这里把它单独作为构建入口（见 vite.config.ts 的 font-preload 插件），
 * 生产环境通过 <link rel="preload" as="style"> + onload 非阻塞应用；
 * 开发环境由 main.tsx 动态 import 加载。
 */
import "harmonyos-sans-sc-webfont-splitted/dist/Regular.css";
import "harmonyos-sans-sc-webfont-splitted/dist/Medium.css";
import "harmonyos-sans-sc-webfont-splitted/dist/Semibold.css";
import "harmonyos-sans-sc-webfont-splitted/dist/Bold.css";
