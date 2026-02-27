import { existsSync } from "fs";

export const detectPackageManager = (): "npm" | "pnpm" | "yarn" | "bun" => {
  if (existsSync("pnpm-lock.yaml")) return "pnpm";
  if (existsSync("yarn.lock")) return "yarn";
  if (existsSync("bun.lockb")) return "bun";
  if (existsSync("package-lock.json")) return "npm";
  return "npm";
};

export const cleanObject = <T extends Record<string, any>>(obj: T): T => {
  const cleaned: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return;
    }
    cleaned[key] = value;
  });
  return cleaned as T;
};
