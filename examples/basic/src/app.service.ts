import { Injectable } from "@nestjs/common";
import { AwsxService } from "@nestp/awsx";

@Injectable()
export class AppService {
  constructor(private readonly awsx: AwsxService) {}

  async uploadSample() {
    return this.awsx.s3.putObject({
      Bucket: "my-bucket",
      Key: "sample.json",
      Body: JSON.stringify({ ok: true }),
    });
  }

  async sendMessage() {
    return this.awsx.sqs.sendMessage({
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
      MessageBody: "hello",
    });
  }
}
