import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import type { Message } from "@aws-sdk/client-sqs";
import { DeleteMessageBatchCommand, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import { AwsxToken } from "../constants";
import { AwsxServiceKey, type AwsxNormalizedConfig } from "../types";
import type { SQSClient } from "@aws-sdk/client-sqs";

export type AwsxSqsConsumerOptions = {
  queueUrl?: string;
  waitTimeSeconds?: number;
  maxNumberOfMessages?: number;
  pollIntervalMs?: number;
};

@Injectable()
export class AwsxSqsConsumerService implements OnModuleDestroy {
  private readonly defaultQueueUrl?: string;
  private readonly client: SQSClient;
  private polling = false;
  private pollTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    @Inject(AwsxToken.SqsClient)
    client: SQSClient,
    @Inject(AwsxToken.Config)
    config: AwsxNormalizedConfig,
  ) {
    this.client = client;
    this.defaultQueueUrl = config.services[AwsxServiceKey.Sqs]?.defaultQueueUrl;
  }

  private resolveQueueUrl(queueUrl?: string): string {
    const resolved = queueUrl ?? this.defaultQueueUrl;
    if (!resolved) {
      throw new Error("[awsx] SQS queue URL is required for consumer. Provide queueUrl or defaultQueueUrl.");
    }
    return resolved;
  }

  /**
   * Start polling the queue and invoke the handler for each batch of messages.
   * Messages are deleted after the handler resolves successfully.
   * Call stop() or let OnModuleDestroy stop the consumer.
   */
  startConsumer(
    handler: (messages: Message[]) => Promise<void>,
    options: AwsxSqsConsumerOptions = {},
  ): void {
    const queueUrl = this.resolveQueueUrl(options.queueUrl);
    const waitTimeSeconds = options.waitTimeSeconds ?? 20;
    const maxNumberOfMessages = Math.min(options.maxNumberOfMessages ?? 10, 10);
    const pollIntervalMs = options.pollIntervalMs ?? 0;

    if (this.polling) {
      throw new Error("[awsx] SQS consumer already running. Stop it before starting another.");
    }
    this.polling = true;

    const poll = async () => {
      if (!this.polling) return;
      try {
        const result = await this.client.send(
          new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            WaitTimeSeconds: waitTimeSeconds,
            MaxNumberOfMessages: maxNumberOfMessages,
            MessageAttributeNames: ["All"],
            AttributeNames: ["All"],
          }),
        );
        const messages = result.Messages ?? [];
        if (messages.length > 0) {
          await handler(messages);
          await this.client.send(
            new DeleteMessageBatchCommand({
              QueueUrl: queueUrl,
              Entries: messages.map((msg, i) => ({
                Id: msg.MessageId ?? `msg-${i}`,
                ReceiptHandle: msg.ReceiptHandle!,
              })),
            }),
          );
        }
      } catch (_) {
        // Don't throw; loop will retry
      }
      if (this.polling) {
        if (pollIntervalMs > 0) {
          this.pollTimer = setTimeout(() => {
            this.pollTimer = null;
            poll();
          }, pollIntervalMs);
        } else {
          setImmediate(poll);
        }
      }
    };

    if (pollIntervalMs > 0) {
      this.pollTimer = setTimeout(() => {
        this.pollTimer = null;
        poll();
      }, pollIntervalMs);
    } else {
      setImmediate(poll);
    }
  }

  stopConsumer(): void {
    this.polling = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  onModuleDestroy(): void {
    this.stopConsumer();
  }
}
