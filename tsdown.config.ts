import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "cli/index": "src/cli/index.ts",
  },
  outDir: "dist",
  format: ["cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
  platform: "node",
  banner: (chunk) => (chunk.name.includes("cli") ? "#!/usr/bin/env node" : ""),
});
