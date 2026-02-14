import { defineConfig } from "tsdown";

const shared = {
  outDir: "dist",
  format: ["cjs"],
  dts: true,
  sourcemap: true,
  target: "es2020",
  platform: "node",
};

export default defineConfig([
  {
    ...shared,
    clean: true,
    entry: {
      index: "src/index.ts",
    },
  },
  {
    ...shared,
    clean: false,
    entry: {
      "cli/index": "src/cli/index.ts",
    },
    banner: "#!/usr/bin/env node",
  },
]);
