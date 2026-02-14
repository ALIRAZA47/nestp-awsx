import { Injectable } from "@nestjs/common";
import { AwsxService } from "@nestp/awsx";

@Injectable()
export class AwsFacadeConsumerService {
  constructor(private readonly awsx: AwsxService) {}

  async runWorkflow() {
    await this.awsx.s3.putObject({
      Bucket: "app-assets",
      Key: "from-facade.txt",
      Body: "ok",
    });

    await this.awsx.sqs.sendMessage({
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/jobs",
      MessageBody: "queued",
    });
  }
}
