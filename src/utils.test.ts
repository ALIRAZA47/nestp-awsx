import { describe, it, expect } from "vitest";
import { Readable } from "stream";
import { toBuffer } from "./utils";

describe("toBuffer", () => {
  describe("null and undefined", () => {
    it("returns empty buffer for null", async () => {
      const result = await toBuffer(null);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBe(0);
    });

    it("returns empty buffer for undefined", async () => {
      const result = await toBuffer(undefined);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBe(0);
    });
  });

  describe("Buffer input", () => {
    it("returns the same buffer when given a Buffer", async () => {
      const input = Buffer.from("hello");
      const result = await toBuffer(input);
      expect(result).toBe(input);
      expect(result.toString()).toBe("hello");
    });

    it("returns buffer with correct content", async () => {
      const input = Buffer.from([1, 2, 3, 4, 5]);
      const result = await toBuffer(input);
      expect(result).toEqual(input);
    });
  });

  describe("Uint8Array input", () => {
    it("converts Uint8Array to Buffer", async () => {
      const input = new Uint8Array([72, 101, 108, 108, 111]);
      const result = await toBuffer(input);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe("Hello");
    });

    it("handles empty Uint8Array", async () => {
      const input = new Uint8Array([]);
      const result = await toBuffer(input);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBe(0);
    });
  });

  describe("string input", () => {
    it("converts string to Buffer using utf-8", async () => {
      const input = "Hello, World!";
      const result = await toBuffer(input);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString("utf-8")).toBe("Hello, World!");
    });

    it("handles empty string", async () => {
      const result = await toBuffer("");
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBe(0);
    });

    it("handles unicode string", async () => {
      const input = "日本語テスト";
      const result = await toBuffer(input);
      expect(result.toString("utf-8")).toBe(input);
    });
  });

  describe("Readable stream input", () => {
    it("collects chunks from Readable stream", async () => {
      const input = Readable.from(["chunk1", "chunk2", "chunk3"]);
      const result = await toBuffer(input);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe("chunk1chunk2chunk3");
    });

    it("handles empty stream", async () => {
      const input = Readable.from([]);
      const result = await toBuffer(input);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBe(0);
    });

    it("handles stream with Buffer chunks", async () => {
      const input = Readable.from([Buffer.from("a"), Buffer.from("b")]);
      const result = await toBuffer(input);
      expect(result.toString()).toBe("ab");
    });

    it("rejects on stream error", async () => {
      const input = new Readable({
        read() {
          this.destroy(new Error("Stream error"));
        },
      });
      await expect(toBuffer(input)).rejects.toThrow("Stream error");
    });
  });

  describe("object with transformToByteArray", () => {
    it("calls transformToByteArray and returns result as Buffer", async () => {
      const bytes = new Uint8Array([1, 2, 3]);
      const input = {
        transformToByteArray: async () => bytes,
      };
      const result = await toBuffer(input);
      expect(result).toBeInstanceOf(Buffer);
      expect(Array.from(result)).toEqual([1, 2, 3]);
    });

    it("handles empty byte array from transformToByteArray", async () => {
      const input = {
        transformToByteArray: async () => new Uint8Array([]),
      };
      const result = await toBuffer(input);
      expect(result.length).toBe(0);
    });
  });

  describe("unsupported types", () => {
    it("throws for plain object", async () => {
      const input = { foo: "bar" };
      await expect(toBuffer(input)).rejects.toThrow("[awsx] Unsupported body type");
    });

    it("throws for number", async () => {
      await expect(toBuffer(42)).rejects.toThrow("[awsx] Unsupported body type");
    });

    it("throws for boolean", async () => {
      await expect(toBuffer(true)).rejects.toThrow("[awsx] Unsupported body type");
    });

    it("throws for array", async () => {
      await expect(toBuffer([1, 2, 3])).rejects.toThrow("[awsx] Unsupported body type");
    });
  });
});
