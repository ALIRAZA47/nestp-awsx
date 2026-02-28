import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AwsxConsoleLogger } from "../../src/logger";

describe("AwsxConsoleLogger", () => {
  let debugSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("debug", () => {
    it("logs string with [awsx] prefix", () => {
      const logger = new AwsxConsoleLogger();
      logger.debug("test message");
      expect(debugSpy).toHaveBeenCalledWith("[awsx]", "test message");
    });

    it("logs object as JSON string", () => {
      const logger = new AwsxConsoleLogger();
      logger.debug({ foo: "bar" });
      expect(debugSpy).toHaveBeenCalledWith("[awsx]", '{"foo":"bar"}');
    });

    it("logs multiple arguments", () => {
      const logger = new AwsxConsoleLogger();
      logger.debug("a", "b", 1);
      expect(debugSpy).toHaveBeenCalledWith("[awsx]", "a", "b", "1");
    });
  });

  describe("info", () => {
    it("logs string with [awsx] prefix", () => {
      const logger = new AwsxConsoleLogger();
      logger.info("info message");
      expect(infoSpy).toHaveBeenCalledWith("[awsx]", "info message");
    });

    it("logs object as JSON string", () => {
      const logger = new AwsxConsoleLogger();
      logger.info({ level: "info" });
      expect(infoSpy).toHaveBeenCalledWith("[awsx]", '{"level":"info"}');
    });
  });

  describe("warn", () => {
    it("logs string with [awsx] prefix", () => {
      const logger = new AwsxConsoleLogger();
      logger.warn("warning");
      expect(warnSpy).toHaveBeenCalledWith("[awsx]", "warning");
    });

    it("handles circular reference via String() fallback", () => {
      const logger = new AwsxConsoleLogger();
      const circular: Record<string, unknown> = {};
      circular.self = circular;
      logger.warn(circular);
      expect(warnSpy).toHaveBeenCalled();
      expect(typeof warnSpy.mock.calls[0][1]).toBe("string");
    });
  });

  describe("error", () => {
    it("logs string with [awsx] prefix", () => {
      const logger = new AwsxConsoleLogger();
      logger.error("error message");
      expect(errorSpy).toHaveBeenCalledWith("[awsx]", "error message");
    });

    it("logs Error object", () => {
      const logger = new AwsxConsoleLogger();
      const err = new Error("Something went wrong");
      logger.error(err);
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
