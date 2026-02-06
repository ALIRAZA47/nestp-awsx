import type { Logger } from "@aws-sdk/types";

const toString = (value: unknown) => {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export class AwsxConsoleLogger implements Logger {
  debug(...args: any[]) {
    console.debug("[awsx]", ...args.map(toString));
  }

  info(...args: any[]) {
    console.info("[awsx]", ...args.map(toString));
  }

  warn(...args: any[]) {
    console.warn("[awsx]", ...args.map(toString));
  }

  error(...args: any[]) {
    console.error("[awsx]", ...args.map(toString));
  }
}
