import { describe, it, expect, vi, beforeEach } from "vitest";
import { SqsService } from "../../src/services/sqs.service";
import { AwsxServiceKey } from "../../src/types";
import type { AwsxNormalizedConfig } from "../../src/types";

const mockConfig: AwsxNormalizedConfig = {
  defaults: {},
  global: {},
  services: {
    [AwsxServiceKey.S3]: { credentials: {}, client: {} },
    [AwsxServiceKey.Sqs]: { credentials: {}, client: {} },
    [AwsxServiceKey.Ses]: { credentials: {}, client: {} },
    [AwsxServiceKey.Route53]: { credentials: {}, client: {} },
  },
};

describe("SqsService", () => {
  let sqsService: SqsService;
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
    sqsService = new SqsService({ send: sendMock } as any, mockConfig);
  });

  describe("sendMessage", () => {
    it("sends message to queue", async () => {
      sendMock.mockResolvedValue({ MessageId: "msg-1" });
      const result = await sqsService.sendMessage({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
        MessageBody: "hello",
      });
      expect(sendMock).toHaveBeenCalled();
      expect(result.MessageId).toBe("msg-1");
    });
  });

  describe("sendJson", () => {
    it("stringifies payload", async () => {
      sendMock.mockResolvedValue({});
      await sqsService.sendJson(
        "https://sqs.us-east-1.amazonaws.com/123/queue",
        { foo: "bar" },
      );
      const call = sendMock.mock.calls[0][0];
      expect(call.input.QueueUrl).toBe("https://sqs.us-east-1.amazonaws.com/123/queue");
      expect(call.input.MessageBody).toBe('{"foo":"bar"}');
    });

    it("uses defaultQueueUrl when queueUrl omitted", async () => {
      const defaultUrl = "https://sqs.us-east-1.amazonaws.com/123/default-queue";
      const configWithDefault: AwsxNormalizedConfig = {
        ...mockConfig,
        services: {
          ...mockConfig.services,
          [AwsxServiceKey.Sqs]: {
            ...mockConfig.services[AwsxServiceKey.Sqs],
            defaultQueueUrl: defaultUrl,
          },
        },
      };
      const serviceWithDefault = new SqsService({ send: sendMock } as any, configWithDefault);
      sendMock.mockResolvedValue({ MessageId: "msg-1" });
      await serviceWithDefault.sendJson({ foo: "bar" });
      expect(sendMock.mock.calls[0][0].input.QueueUrl).toBe(defaultUrl);
      expect(sendMock.mock.calls[0][0].input.MessageBody).toBe('{"foo":"bar"}');
    });
  });

  describe("receiveMessages", () => {
    it("returns messages", async () => {
      sendMock.mockResolvedValue({
        Messages: [
          { MessageId: "1", Body: "a" },
          { MessageId: "2", Body: "b" },
        ],
      });
      const result = await sqsService.receiveMessages({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
      });
      expect(result.Messages).toHaveLength(2);
    });
  });

  describe("receiveJson", () => {
    it("parses JSON bodies", async () => {
      sendMock.mockResolvedValue({
        Messages: [
          { MessageId: "1", Body: '{"x":1}' },
          { MessageId: "2", Body: '{"y":2}' },
        ],
      });
      const result = await sqsService.receiveJson({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
      });
      expect(result).toEqual([
        { messageId: "1", body: { x: 1 } },
        { messageId: "2", body: { y: 2 } },
      ]);
    });

    it("handles empty Body", async () => {
      sendMock.mockResolvedValue({
        Messages: [{ MessageId: "1" }],
      });
      const result = await sqsService.receiveJson({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
      });
      expect(result[0].body).toBeNull();
    });

    it("returns empty array when no messages", async () => {
      sendMock.mockResolvedValue({ Messages: [] });
      const result = await sqsService.receiveJson({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
      });
      expect(result).toEqual([]);
    });

    it("returns empty array when Messages is undefined", async () => {
      sendMock.mockResolvedValue({});
      const result = await sqsService.receiveJson({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
      });
      expect(result).toEqual([]);
    });

    it("throws descriptive error on malformed JSON", async () => {
      sendMock.mockResolvedValue({
        Messages: [{ MessageId: "1", Body: "not valid json {" }],
      });
      await expect(
        sqsService.receiveJson({
          QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
        }),
      ).rejects.toThrow("[awsx] Invalid JSON in SQS message 1");
    });
  });

  describe("sendJsonBatch", () => {
    it("sends batch with stringified bodies", async () => {
      sendMock.mockResolvedValue({ Successful: [], Failed: [] });
      await sqsService.sendJsonBatch({
        queueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
        entries: [
          { body: { a: 1 } },
          { id: "custom-id", body: { b: 2 } },
        ],
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.Entries[0].MessageBody).toBe('{"a":1}');
      expect(call.input.Entries[0].Id).toBe("msg-1");
      expect(call.input.Entries[1].Id).toBe("custom-id");
    });
  });

  describe("deleteMessage", () => {
    it("deletes message", async () => {
      sendMock.mockResolvedValue({});
      await sqsService.deleteMessage({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
        ReceiptHandle: "handle",
      });
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe("purgeQueue", () => {
    it("purges queue", async () => {
      sendMock.mockResolvedValue({});
      await sqsService.purgeQueue({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
      });
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe("processBatch", () => {
    it("receives, runs processor, then deletes messages", async () => {
      const processor = vi.fn().mockResolvedValue(undefined);
      sendMock
        .mockResolvedValueOnce({
          Messages: [
            { MessageId: "1", ReceiptHandle: "h1", Body: "a" },
            { MessageId: "2", ReceiptHandle: "h2", Body: "b" },
          ],
        })
        .mockResolvedValueOnce({});
      await sqsService.processBatch(
        { QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue" },
        processor,
      );
      expect(processor).toHaveBeenCalledTimes(1);
      expect(processor.mock.calls[0][0]).toHaveLength(2);
      expect(sendMock).toHaveBeenCalledTimes(2);
      const deleteCall = sendMock.mock.calls[1][0];
      expect(deleteCall.input.QueueUrl).toBe("https://sqs.us-east-1.amazonaws.com/123/queue");
      expect(deleteCall.input.Entries).toEqual([
        { Id: "1", ReceiptHandle: "h1" },
        { Id: "2", ReceiptHandle: "h2" },
      ]);
    });

    it("does not delete when processor throws", async () => {
      sendMock.mockResolvedValueOnce({
        Messages: [{ MessageId: "1", ReceiptHandle: "h1" }],
      });
      await expect(
        sqsService.processBatch(
          { QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue" },
          () => Promise.reject(new Error("process failed")),
        ),
      ).rejects.toThrow("process failed");
      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    it("does nothing when no messages received", async () => {
      sendMock.mockResolvedValueOnce({ Messages: [] });
      const processor = vi.fn();
      await sqsService.processBatch(
        { QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue" },
        processor,
      );
      expect(processor).not.toHaveBeenCalled();
      expect(sendMock).toHaveBeenCalledTimes(1);
    });
  });
});
