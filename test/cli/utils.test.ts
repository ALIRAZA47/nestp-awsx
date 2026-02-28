import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { existsSync } from "fs";
import { detectPackageManager, cleanObject } from "../../src/cli/utils";

vi.mock("fs", () => ({
  existsSync: vi.fn(),
}));

describe("detectPackageManager", () => {
  beforeEach(() => {
    vi.mocked(existsSync).mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns pnpm when pnpm-lock.yaml exists", () => {
    vi.mocked(existsSync).mockImplementation((path: string) => path === "pnpm-lock.yaml");
    expect(detectPackageManager()).toBe("pnpm");
  });

  it("returns yarn when yarn.lock exists", () => {
    vi.mocked(existsSync).mockImplementation((path: string) => path === "yarn.lock");
    expect(detectPackageManager()).toBe("yarn");
  });

  it("returns bun when bun.lockb exists", () => {
    vi.mocked(existsSync).mockImplementation((path: string) => path === "bun.lockb");
    expect(detectPackageManager()).toBe("bun");
  });

  it("returns npm when package-lock.json exists", () => {
    vi.mocked(existsSync).mockImplementation((path: string) => path === "package-lock.json");
    expect(detectPackageManager()).toBe("npm");
  });

  it("returns npm when no lock file exists (default)", () => {
    vi.mocked(existsSync).mockReturnValue(false);
    expect(detectPackageManager()).toBe("npm");
  });

  it("prefers pnpm over others when multiple exist", () => {
    vi.mocked(existsSync).mockReturnValue(true);
    expect(detectPackageManager()).toBe("pnpm");
  });
});

describe("cleanObject", () => {
  it("removes undefined values", () => {
    const result = cleanObject({ a: 1, b: undefined, c: 3 });
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("removes empty string values", () => {
    const result = cleanObject({ a: "x", b: "", c: "y" });
    expect(result).toEqual({ a: "x", c: "y" });
  });

  it("removes empty arrays", () => {
    const result = cleanObject({ a: [1, 2], b: [], c: [3] });
    expect(result).toEqual({ a: [1, 2], c: [3] });
  });

  it("removes empty objects", () => {
    const result = cleanObject({ a: { x: 1 }, b: {}, c: { y: 2 } });
    expect(result).toEqual({ a: { x: 1 }, c: { y: 2 } });
  });

  it("preserves objects with properties", () => {
    const result = cleanObject({ nested: { foo: "bar" } });
    expect(result).toEqual({ nested: { foo: "bar" } });
  });

  it("preserves falsy values except undefined and empty string", () => {
    const result = cleanObject({ a: 0, b: false, c: null });
    expect(result).toEqual({ a: 0, b: false, c: null });
  });

  it("returns empty object when all values are empty", () => {
    const result = cleanObject({ a: undefined, b: "", c: [], d: {} });
    expect(result).toEqual({});
  });

  it("handles nested empty objects in arrays", () => {
    const result = cleanObject({ arr: [{}, { x: 1 }] });
    expect(result).toEqual({ arr: [{}, { x: 1 }] });
  });
});
