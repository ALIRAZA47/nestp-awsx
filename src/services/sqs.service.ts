import { Inject, Injectable } from "@nestjs/common";
import {
  DeleteMessageCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  type DeleteMessageCommandInput,
  type DeleteMessageBatchCommandInput,
  type DeleteMessageBatchCommandOutput,
  type PurgeQueueCommandInput,
  type ReceiveMessageCommandInput,
  type ReceiveMessageCommandOutput,
  type SendMessageBatchCommandInput,
  type SendMessageBatchCommandOutput,
  type SendMessageCommandInput,
  type SendMessageCommandOutput,
  DeleteMessageBatchCommand,
  SendMessageBatchCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { AwsxToken } from "../constants";

@Injectable()
export class SqsService {
  constructor(
    @Inject(AwsxToken.SqsClient)
    private readonly client: SQSClient,
  ) {}

  async sendMessage(params: SendMessageCommandInput): Promise<SendMessageCommandOutput> {
    return this.client.send(new SendMessageCommand(params));
  }

  async sendJson(
    queueUrl: string,
    payload: unknown,
    options: Omit<SendMessageCommandInput, "QueueUrl" | "MessageBody"> = {},
  ): Promise<SendMessageCommandOutput> {
    return this.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
      ...options,
    });
  }

  async receiveMessages(params: ReceiveMessageCommandInput): Promise<ReceiveMessageCommandOutput> {
    return this.client.send(new ReceiveMessageCommand(params));
  }

  async receiveJson<T = unknown>(
    params: ReceiveMessageCommandInput,
  ): Promise<Array<{ messageId?: string; body: T }>> {
    const result = await this.receiveMessages(params);
    return (result.Messages ?? []).map((message) => ({
      messageId: message.MessageId,
      body: message.Body ? (JSON.parse(message.Body) as T) : (null as T),
    }));
  }

  async deleteMessage(params: DeleteMessageCommandInput) {
    return this.client.send(new DeleteMessageCommand(params));
  }

  async purgeQueue(params: PurgeQueueCommandInput) {
    return this.client.send(new PurgeQueueCommand(params));
  }

  async sendBatch(params: SendMessageBatchCommandInput): Promise<SendMessageBatchCommandOutput> {
    return this.client.send(new SendMessageBatchCommand(params));
  }

  async sendJsonBatch(params: {
    queueUrl: string;
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
    return this.sendBatch({ QueueUrl: params.queueUrl, Entries: entries });
  }

  async deleteBatch(
    params: DeleteMessageBatchCommandInput,
  ): Promise<DeleteMessageBatchCommandOutput> {
    return this.client.send(new DeleteMessageBatchCommand(params));
  }
}
