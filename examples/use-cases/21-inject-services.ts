import { Injectable } from "@nestjs/common";
import {
  Route53Service,
  S3Service,
  SesService,
  SqsService,
} from "@nestp/awsx";

@Injectable()
export class AwsServicesConsumer {
  constructor(
    public readonly s3: S3Service,
    public readonly sqs: SqsService,
    public readonly ses: SesService,
    public readonly route53: Route53Service,
  ) {}
}
