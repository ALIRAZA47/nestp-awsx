import { Injectable } from "@nestjs/common";
import { SqsService } from "@nestp/awsx";

@Injectable()
export class SqsCoreExampleService {
  constructor(private readonly sqs: SqsService) {}

  async processSingleMessage() {
    const queueUrl = "https://sqs.us-east-1.amazonaws.com/123/orders";

    await this.sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: "hello",
    });

    const received = await this.sqs.receiveMessages({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
    });

    if (received.Messages?.[0]?.ReceiptHandle) {
      await this.sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: received.Messages[0].ReceiptHandle,
      });
    }

    await this.sqs.purgeQueue({ QueueUrl: queueUrl });
  }
}
