import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { dotaVitePlugins } from "@ayu-sh-kr/dota-wrap/vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    ...dotaVitePlugins({
      root: projectRoot,
      scanRoots: [projectRoot],
      logType: "info",
      webTypes: {
        outFile: "web-types.json",
        customElementsManifest: { enabled: true },
      },
      eventMap: {
        outFile: "src/event-map.d.ts",
      },
    }),
  ],
  resolve: {
    alias: {
      "@app": resolve("./src"),
    },
  },
  publicDir: "public",
});
