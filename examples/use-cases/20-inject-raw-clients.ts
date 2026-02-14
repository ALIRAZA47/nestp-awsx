import { Inject, Injectable } from "@nestjs/common";
import type { Route53Client } from "@aws-sdk/client-route-53";
import type { S3Client } from "@aws-sdk/client-s3";
import type { SESClient } from "@aws-sdk/client-ses";
import type { SQSClient } from "@aws-sdk/client-sqs";
import { AwsxToken } from "@nestp/awsx";

@Injectable()
export class AwsClientsConsumer {
  constructor(
    @Inject(AwsxToken.S3Client) public readonly s3Client: S3Client,
    @Inject(AwsxToken.SqsClient) public readonly sqsClient: SQSClient,
    @Inject(AwsxToken.SesClient) public readonly sesClient: SESClient,
    @Inject(AwsxToken.Route53Client) public readonly route53Client: Route53Client,
  ) {}
}
