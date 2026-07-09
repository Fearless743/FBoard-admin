import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "node:fs";

const localesSrc = path.resolve(__dirname, "src/locales");
const localesDest = path.resolve(__dirname, "../Fboard/public/assets/admin/locales");

function copyLocales() {
  return {
    name: "copy-locales",
    closeBundle() {
      fs.mkdirSync(localesDest, { recursive: true });
      for (const f of fs.readdirSync(localesSrc)) {
        if (f.endsWith(".js")) fs.copyFileSync(path.join(localesSrc, f), path.join(localesDest, f));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyLocales()],
  build: {
    outDir: path.resolve(__dirname, "../Fboard/public/assets/admin"),
    manifest: true,
    minify: false,
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

