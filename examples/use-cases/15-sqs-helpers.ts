import { Injectable } from "@nestjs/common";
import { SqsService } from "@nestp/awsx";

@Injectable()
export class SqsHelperExampleService {
  constructor(private readonly sqs: SqsService) {}

  async runHelpers() {
    const queueUrl = "https://sqs.us-east-1.amazonaws.com/123/orders";

    await this.sqs.sendJson(queueUrl, {
      orderId: "o_001",
      status: "created",
    });

    const messages = await this.sqs.receiveJson<{ orderId: string; status: string }>({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
    });

    await this.sqs.sendBatch({
      QueueUrl: queueUrl,
      Entries: [
        { Id: "e1", MessageBody: "one" },
        { Id: "e2", MessageBody: "two" },
      ],
    });

    await this.sqs.sendJsonBatch({
      queueUrl,
      entries: [
        { id: "json-1", body: { orderId: "o_002" } },
        { id: "json-2", body: { orderId: "o_003" } },
      ],
    });

    await this.sqs.deleteBatch({
      QueueUrl: queueUrl,
      Entries: [
        {
          Id: "r1",
          ReceiptHandle: "AQEB...example",
        },
      ],
    });

    return messages;
  }
}
