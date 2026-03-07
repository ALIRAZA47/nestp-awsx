import { Inject, Injectable } from "@nestjs/common";
import type { Message } from "@aws-sdk/client-sqs";
import {
  DeleteMessageBatchCommand,
  DeleteMessageCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  type DeleteMessageBatchCommandInput,
  type DeleteMessageBatchCommandOutput,
  type DeleteMessageCommandInput,
  type PurgeQueueCommandInput,
  type ReceiveMessageCommandInput,
  type ReceiveMessageCommandOutput,
  type SendMessageBatchCommandInput,
  type SendMessageBatchCommandOutput,
  type SendMessageCommandInput,
  type SendMessageCommandOutput,
  SendMessageBatchCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { AwsxToken } from "../constants";
import { AwsxServiceKey, type AwsxNormalizedConfig } from "../types";

type SqsInput<T> = Omit<T, "QueueUrl"> & { QueueUrl?: string };

@Injectable()
export class SqsService {
  private readonly defaultQueueUrl?: string;

  constructor(
    @Inject(AwsxToken.SqsClient)
    private readonly client: SQSClient,
    @Inject(AwsxToken.Config)
    config: AwsxNormalizedConfig,
  ) {
    this.defaultQueueUrl = config.services[AwsxServiceKey.Sqs]?.defaultQueueUrl;
  }

  private resolveQueueUrl(queueUrl?: string): string {
    const resolved = queueUrl ?? this.defaultQueueUrl;
    if (!resolved) {
      throw new Error("[awsx] SQS queue URL is required. Provide QueueUrl or defaultQueueUrl.");
    }
    return resolved;
  }

  private withQueueUrl<T extends { QueueUrl?: string }>(params: T): T & { QueueUrl: string } {
    return { ...params, QueueUrl: this.resolveQueueUrl(params.QueueUrl) };
  }

  async sendMessage(params: SqsInput<SendMessageCommandInput>): Promise<SendMessageCommandOutput> {
    return this.client.send(new SendMessageCommand(this.withQueueUrl(params)));
  }

  async sendJson(
    queueUrl: string,
    payload: unknown,
    options?: Omit<SendMessageCommandInput, "QueueUrl" | "MessageBody">,
  ): Promise<SendMessageCommandOutput>;
  async sendJson(
    payload: unknown,
    options?: Omit<SendMessageCommandInput, "QueueUrl" | "MessageBody">,
  ): Promise<SendMessageCommandOutput>;
  async sendJson(
    queueUrlOrPayload: string | unknown,
    payloadOrOptions?: unknown,
    options?: Omit<SendMessageCommandInput, "QueueUrl" | "MessageBody">,
  ): Promise<SendMessageCommandOutput> {
    if (typeof queueUrlOrPayload === "string") {
      return this.sendMessage({
        QueueUrl: this.resolveQueueUrl(queueUrlOrPayload),
        MessageBody: JSON.stringify(payloadOrOptions),
        ...options,
      });
    }
    return this.sendMessage({
      QueueUrl: this.resolveQueueUrl(),
      MessageBody: JSON.stringify(queueUrlOrPayload),
      ...(payloadOrOptions as Omit<SendMessageCommandInput, "QueueUrl" | "MessageBody">),
    });
  }

  async receiveMessages(
    params: SqsInput<ReceiveMessageCommandInput>,
  ): Promise<ReceiveMessageCommandOutput> {
    return this.client.send(new ReceiveMessageCommand(this.withQueueUrl(params)));
  }

  async receiveJson<T = unknown>(
    params: SqsInput<ReceiveMessageCommandInput>,
  ): Promise<Array<{ messageId?: string; body: T }>> {
    const result = await this.receiveMessages(params);
    return (result.Messages ?? []).map((message) => {
      if (!message.Body) {
        return { messageId: message.MessageId, body: null as T };
      }
      try {
        return {
          messageId: message.MessageId,
          body: JSON.parse(message.Body) as T,
        };
      } catch (error) {
        const msg = `[awsx] Invalid JSON in SQS message ${message.MessageId ?? "(no id)"}`;
        throw error instanceof SyntaxError
          ? new SyntaxError(`${msg}: ${(error as SyntaxError).message}`)
          : new Error(`${msg}: ${String(error)}`);
      }
    });
  }

  async deleteMessage(params: SqsInput<DeleteMessageCommandInput>) {
    return this.client.send(new DeleteMessageCommand(this.withQueueUrl(params)));
  }

  async purgeQueue(params: SqsInput<PurgeQueueCommandInput>) {
    return this.client.send(new PurgeQueueCommand(this.withQueueUrl(params)));
  }

  async sendBatch(
    params: SqsInput<SendMessageBatchCommandInput>,
  ): Promise<SendMessageBatchCommandOutput> {
    return this.client.send(new SendMessageBatchCommand(this.withQueueUrl(params)));
  }

  async sendJsonBatch(params: {
    queueUrl?: string;
    entries: Array<{
      id?: string;
      body: unknown;
      delaySeconds?: number;
      messageAttributes?: Record<string, any>;
      messageGroupId?: string;
      messageDeduplicationId?: string;
    }>;
  }): Promise<SendMessageBatchCommandOutput> {
    const entries = params.entries.map((entry, index) => ({
      Id: entry.id ?? `msg-${index + 1}`,
      MessageBody: JSON.stringify(entry.body),
      DelaySeconds: entry.delaySeconds,
      MessageAttributes: entry.messageAttributes,
      MessageGroupId: entry.messageGroupId,
      MessageDeduplicationId: entry.messageDeduplicationId,
    }));
    return this.sendBatch({
      QueueUrl: this.resolveQueueUrl(params.queueUrl),
      Entries: entries,
    });
  }

  async deleteBatch(
    params: SqsInput<DeleteMessageBatchCommandInput>,
  ): Promise<DeleteMessageBatchCommandOutput> {
    return this.client.send(new DeleteMessageBatchCommand(this.withQueueUrl(params)));
  }

  /**
   * Receive messages, run the processor, then delete them on success.
   * If the processor throws, messages are not deleted and will become visible again after visibility timeout.
   */
  async processBatch(
    params: SqsInput<ReceiveMessageCommandInput>,
    processor: (messages: Message[]) => Promise<void>,
  ): Promise<void> {
    const result = await this.receiveMessages(params);
    const messages = result.Messages ?? [];
    if (messages.length === 0) return;
    await processor(messages);
    const queueUrl = this.resolveQueueUrl(params.QueueUrl);
    const deleteParams: DeleteMessageBatchCommandInput = {
      QueueUrl: queueUrl,
      Entries: messages.map((msg, i) => ({
        Id: msg.MessageId ?? `msg-${i}`,
        ReceiptHandle: msg.ReceiptHandle!,
      })),
    };
    await this.client.send(new DeleteMessageBatchCommand(deleteParams));
  }
}
