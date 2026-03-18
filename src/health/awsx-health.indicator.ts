import { Inject, Injectable } from "@nestjs/common";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { GetQueueAttributesCommand } from "@aws-sdk/client-sqs";
import { GetAccountCommand } from "@aws-sdk/client-ses";
import { ListEventBusesCommand } from "@aws-sdk/client-eventbridge";
import { AwsxToken } from "../constants";
import type { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import type { S3Client } from "@aws-sdk/client-s3";
import type { SQSClient } from "@aws-sdk/client-sqs";
import type { SESClient } from "@aws-sdk/client-ses";

/**
 * Health check result compatible with @nestjs/terminus.
 * Use with HealthCheckService.check([ () => this.awsxHealth.checkS3('s3'), ... ]).
 */
export type AwsxHealthIndicatorResult = Record<
  string,
  { status: "up" | "down"; message?: string }
>;

@Injectable()
export class AwsxHealthIndicator {
  constructor(
    @Inject(AwsxToken.S3Client)
    private readonly s3: S3Client,
    @Inject(AwsxToken.SqsClient)
    private readonly sqs: SQSClient,
    @Inject(AwsxToken.SesClient)
    private readonly ses: SESClient,
    @Inject(AwsxToken.EventBridgeClient)
    private readonly eventBridge: EventBridgeClient,
  ) {}

  async checkS3(key: string, bucket: string): Promise<AwsxHealthIndicatorResult> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: bucket }));
      return { [key]: { status: "up" } };
    } catch (err: any) {
      return {
        [key]: {
          status: "down",
          message: err?.message ?? String(err),
        },
      };
    }
  }

  async checkSqs(key: string, queueUrl: string): Promise<AwsxHealthIndicatorResult> {
    try {
      await this.sqs.send(
        new GetQueueAttributesCommand({
          QueueUrl: queueUrl,
          AttributeNames: ["ApproximateNumberOfMessages"],
        }),
      );
      return { [key]: { status: "up" } };
    } catch (err: any) {
      return {
        [key]: {
          status: "down",
          message: err?.message ?? String(err),
        },
      };
    }
  }

  async checkSes(key: string): Promise<AwsxHealthIndicatorResult> {
    try {
      await this.ses.send(new GetAccountCommand({}));
      return { [key]: { status: "up" } };
    } catch (err: any) {
      return {
        [key]: {
          status: "down",
          message: err?.message ?? String(err),
        },
      };
    }
  }

  async checkEventBridge(key: string): Promise<AwsxHealthIndicatorResult> {
    try {
      await this.eventBridge.send(new ListEventBusesCommand({ Limit: 1 }));
      return { [key]: { status: "up" } };
    } catch (err: any) {
      return {
        [key]: {
          status: "down",
          message: err?.message ?? String(err),
        },
      };
    }
  }
}
