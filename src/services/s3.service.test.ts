import { describe, it, expect, vi, beforeEach } from "vitest";
import { S3Service } from "./s3.service";
import { AwsxServiceKey } from "../types";
import type { AwsxNormalizedConfig } from "../types";

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn().mockResolvedValue("https://signed-url.example.com"),
}));

vi.mock("@aws-sdk/lib-storage", () => ({
  Upload: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    done: vi.fn().mockResolvedValue({}),
  })),
}));

describe("S3Service", () => {
  let s3Service: S3Service;
  let sendMock: ReturnType<typeof vi.fn>;

  const createService = (overrides?: Partial<AwsxNormalizedConfig["services"]["s3"]>) => {
    const config: AwsxNormalizedConfig = {
      defaults: {},
      global: {},
      services: {
        [AwsxServiceKey.S3]: {
          defaultBucket: "test-bucket",
          credentials: {},
          client: {},
          ...overrides,
        },
        [AwsxServiceKey.Sqs]: { credentials: {}, client: {} },
        [AwsxServiceKey.Ses]: { credentials: {}, client: {} },
        [AwsxServiceKey.Route53]: { credentials: {}, client: {} },
      },
    };
    const mockClient = { send: sendMock };
    return new S3Service(mockClient as any, config);
  };

  beforeEach(() => {
    sendMock = vi.fn();
    s3Service = createService();
  });

  describe("putObject", () => {
    it("uses defaultBucket when Bucket not provided", async () => {
      sendMock.mockResolvedValue({});
      await s3Service.putObject({ Key: "foo", Body: "data" });
      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({ Bucket: "test-bucket", Key: "foo" }),
        }),
      );
    });

    it("uses provided Bucket over defaultBucket", async () => {
      sendMock.mockResolvedValue({});
      await s3Service.putObject({
        Bucket: "custom-bucket",
        Key: "foo",
        Body: "data",
      });
      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({ Bucket: "custom-bucket" }),
        }),
      );
    });
  });

  describe("getObject", () => {
    it("returns body as Buffer", async () => {
      sendMock.mockResolvedValue({
        Body: "hello",
      });
      const result = await s3Service.getObject({ Key: "foo" });
      expect(result.body).toBeInstanceOf(Buffer);
      expect(result.body.toString()).toBe("hello");
    });
  });

  describe("resolveBucket", () => {
    it("throws when no bucket and no defaultBucket", async () => {
      const serviceNoBucket = createService({ defaultBucket: undefined });
      await expect(serviceNoBucket.putObject({ Key: "foo", Body: "data" })).rejects.toThrow(
        "[awsx] S3 bucket is required. Provide Bucket or defaultBucket.",
      );
    });
  });

  describe("putJson", () => {
    it("accepts (bucket, key, data) signature", async () => {
      sendMock.mockResolvedValue({});
      await s3Service.putJson("test-bucket", "data.json", { foo: "bar" });
      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            Bucket: "test-bucket",
            Key: "data.json",
            ContentType: "application/json",
          }),
        }),
      );
      const body = sendMock.mock.calls[0][0].input.Body;
      expect(body).toBe(JSON.stringify({ foo: "bar" }));
    });

    it("accepts params object signature", async () => {
      sendMock.mockResolvedValue({});
      await s3Service.putJson({
        key: "data.json",
        data: { x: 1 },
      });
      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({ Key: "data.json" }),
        }),
      );
    });
  });

  describe("getJson", () => {
    it("parses JSON from body", async () => {
      sendMock.mockResolvedValue({ Body: JSON.stringify({ a: 1, b: 2 }) });
      const result = await s3Service.getJson({ Key: "data.json" });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe("exists", () => {
    it("returns true when object exists", async () => {
      sendMock.mockResolvedValue({});
      const result = await s3Service.exists({ Key: "foo" });
      expect(result).toBe(true);
    });

    it("returns false when NotFound (by name)", async () => {
      const err = new Error("Not Found");
      (err as any).name = "NotFound";
      sendMock.mockRejectedValue(err);
      const result = await s3Service.exists({ Key: "missing" });
      expect(result).toBe(false);
    });

    it("returns false when NoSuchKey", async () => {
      const err = new Error("No such key");
      (err as any).name = "NoSuchKey";
      sendMock.mockRejectedValue(err);
      const result = await s3Service.exists({ Key: "missing" });
      expect(result).toBe(false);
    });

    it("rethrows on other errors", async () => {
      sendMock.mockRejectedValue(new Error("Access denied"));
      await expect(s3Service.exists({ Key: "foo" })).rejects.toThrow("Access denied");
    });
  });

  describe("listKeys", () => {
    it("returns array of keys", async () => {
      sendMock.mockResolvedValue({
        Contents: [{ Key: "a" }, { Key: "b" }, {}],
      });
      const result = await s3Service.listKeys({});
      expect(result).toEqual(["a", "b"]);
    });
  });

  describe("getSignedUrl", () => {
    it("returns signed URL", async () => {
      const url = await s3Service.getSignedUrl({
        operation: "getObject" as any,
        input: { Key: "file.txt" },
      });
      expect(url).toBe("https://signed-url.example.com");
    });
  });

  describe("deleteObject", () => {
    it("deletes object with bucket", async () => {
      sendMock.mockResolvedValue({});
      await s3Service.deleteObject({ Key: "to-delete" });
      expect(sendMock).toHaveBeenCalled();
      const call = sendMock.mock.calls[0][0];
      expect(call.input.Bucket).toBe("test-bucket");
      expect(call.input.Key).toBe("to-delete");
    });
  });

  describe("deleteMany", () => {
    it("deletes multiple objects", async () => {
      sendMock.mockResolvedValue({});
      await s3Service.deleteMany({
        Delete: { Objects: [{ Key: "a" }, { Key: "b" }] },
      });
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe("putMany", () => {
    it("returns successes and failures", async () => {
      sendMock
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce({});
      const result = await s3Service.putMany([
        { Key: "a", Body: "1" },
        { Key: "b", Body: "2" },
        { Key: "c", Body: "3" },
      ]);
      expect(result.successes).toHaveLength(2);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0].index).toBe(1);
      expect(result.failures[0].error).toBeInstanceOf(Error);
    });

    it("handles empty items array", async () => {
      const result = await s3Service.putMany([]);
      expect(result.successes).toHaveLength(0);
      expect(result.failures).toHaveLength(0);
    });

    it("respects concurrency option", async () => {
      sendMock.mockResolvedValue({});
      const result = await s3Service.putMany(
        [{ Key: "a", Body: "1" }, { Key: "b", Body: "2" }],
        { concurrency: 1 },
      );
      expect(result.successes).toHaveLength(2);
    });
  });

  describe("uploadWithProgress", () => {
    it("completes upload", async () => {
      const result = await s3Service.uploadWithProgress({
        input: { Key: "large.txt", Body: "data" },
      });
      expect(result).toBeDefined();
    });
  });
});
