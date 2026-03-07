import { defineConfig } from "vitest/config";
import TableSummaryReporter from "./test/vitest-table-reporter.ts";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
    reporters: [
      ["verbose", { summary: true }],
      TableSummaryReporter,
    ],
  },
});
