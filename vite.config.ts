import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import dotaVitePreloader from "@ayu-sh-kr/dota-wrap/preloader-plugin";
import dotaWebTypeJson from "@ayu-sh-kr/dota-wrap/web-type-json";

export default defineConfig({
  plugins: [
    tailwindcss(),
    dotaVitePreloader({
      root: resolve(__dirname),
      logType: "info",
    }),
    dotaWebTypeJson({
      root: resolve(__dirname),
      scanRoots: [resolve(__dirname)],
      outFile: "web-types.json",
      logType: "info",
    }),
  ],
  resolve: {
    alias: {
      "@app": resolve("./src"),
    },
  },
  publicDir: "public",
});