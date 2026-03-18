/**
 * Custom Vitest reporter that prints a per-file summary table at the end of a test run,
 * grouped by AWS service type (S3, SQS, SES, Route53, EventBridge) and other categories.
 */
import type { Reporter } from "vitest/reporters";

type VitestContext = {
  state?: { getReportedEntity: (task: unknown) => unknown };
};

type Row = {
  file: string;
  group: string;
  tests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
};

const GROUP_ORDER = ["S3", "SQS", "SES", "Route53", "EventBridge", "Module", "Unit", "CLI"] as const;

function getGroup(moduleId: string): string {
  const normalized = moduleId.replace(/\\/g, "/");
  if (normalized.includes("services/s3") || /s3\.service\.test\.ts$/i.test(normalized)) return "S3";
  if (normalized.includes("services/sqs") || /sqs\.service\.test\.ts$/i.test(normalized)) return "SQS";
  if (normalized.includes("services/ses") || /ses\.service\.test\.ts$/i.test(normalized)) return "SES";
  if (normalized.includes("services/route53") || /route53\.service\.test\.ts$/i.test(normalized)) return "Route53";
  if (normalized.includes("services/eventbridge") || /eventbridge\.service\.test\.ts$/i.test(normalized)) return "EventBridge";
  if (normalized.includes("module/")) return "Module";
  if (normalized.includes("cli/")) return "CLI";
  if (normalized.includes("unit/")) return "Unit";
  return "Other";
}

function countTests(module: {
  children?: { allTests?: () => Iterable<{ result?: () => { state?: string } }> };
}): { passed: number; failed: number; skipped: number } {
  let passed = 0,
    failed = 0,
    skipped = 0;
  const children = module.children;
  if (!children?.allTests) return { passed, failed, skipped };
  for (const test of children.allTests()) {
    const state = test.result?.()?.state ?? "unknown";
    if (state === "passed") passed++;
    else if (state === "failed") failed++;
    else skipped++;
  }
  return { passed, failed, skipped };
}

function formatDuration(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

function printTable(rows: Row[], totalDuration: number): void {
  const maxFile = Math.max(32, ...rows.map((r) => r.file.length));
  const col = (s: string, w: number) => s.padEnd(w);
  const serviceWidth = 12;
  const header =
    col(" Service", serviceWidth) +
    col("File", maxFile + 1) +
    col("Tests", 8) +
    col("Passed", 8) +
    col("Failed", 8) +
    col("Skipped", 8) +
    " Duration";
  const sep = "─".repeat(header.length);

  const byGroup = new Map<string, Row[]>();
  for (const r of rows) {
    const list = byGroup.get(r.group) ?? [];
    list.push(r);
    byGroup.set(r.group, list);
  }

  const orderedGroups = [...GROUP_ORDER.filter((g) => byGroup.has(g)), ...[...byGroup.keys()].filter((g) => !GROUP_ORDER.includes(g as (typeof GROUP_ORDER)[number]))];

  const sortedRows: Row[] = [];
  for (const groupName of orderedGroups) {
    const groupRows = [...(byGroup.get(groupName) ?? [])].sort((a, b) => a.file.localeCompare(b.file));
    sortedRows.push(...groupRows);
  }

  console.log("\n" + sep);
  console.log(header);
  console.log(sep);

  let totalTests = 0,
    totalPassed = 0,
    totalFailed = 0,
    totalSkipped = 0;

  for (const r of sortedRows) {
    const file = (r.file.length > maxFile ? "…" + r.file.slice(-maxFile + 1) : r.file).padEnd(maxFile + 1);
    console.log(
      col(r.group, serviceWidth) +
        file +
        String(r.tests).padEnd(8) +
        String(r.passed).padEnd(8) +
        String(r.failed).padEnd(8) +
        String(r.skipped).padEnd(8) +
        formatDuration(r.duration),
    );
    totalTests += r.tests;
    totalPassed += r.passed;
    totalFailed += r.failed;
    totalSkipped += r.skipped;
  }

  console.log(sep);
  console.log(
    col(" TOTAL", serviceWidth) +
      col("", maxFile + 1) +
      String(totalTests).padEnd(8) +
      String(totalPassed).padEnd(8) +
      String(totalFailed).padEnd(8) +
      String(totalSkipped).padEnd(8) +
      formatDuration(totalDuration),
  );
  console.log(sep + "\n");
}

const TableSummaryReporter: Reporter & { ctx: VitestContext | null } = {
  ctx: null,

  onInit(ctx: unknown) {
    this.ctx = ctx as VitestContext;
  },

  onFinished(files: unknown[]) {
    if (!this.ctx?.state?.getReportedEntity || !Array.isArray(files)) return;
    const rows: Row[] = [];
    let totalDuration = 0;
    for (const fileTask of files) {
      const mod = this.ctx.state!.getReportedEntity(fileTask) as {
        moduleId?: string;
        diagnostic?: () => { duration?: number };
        children?: { allTests?: () => Iterable<unknown> };
      } | null;
      if (!mod) continue;
      const { passed, failed, skipped } = countTests(mod as Parameters<typeof countTests>[0]);
      const tests = passed + failed + skipped;
      const duration = mod.diagnostic?.()?.duration ?? 0;
      totalDuration += duration;
      const raw = mod.moduleId ?? "?";
      const parts = raw.replace(/\\/g, "/").split("/");
      const file = parts.length >= 2 ? `${parts[parts.length - 2]}/${parts[parts.length - 1]}` : parts[parts.length - 1];
      const group = getGroup(raw);
      rows.push({ file, group, tests, passed, failed, skipped, duration });
    }
    if (rows.length > 0) {
      printTable(rows, totalDuration);
    }
  },
};

export default TableSummaryReporter;
