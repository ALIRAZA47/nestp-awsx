import { Inject, Injectable } from "@nestjs/common";
import {
  AwsxToken,
} from "./constants";
import { Route53Service } from "./services/route53.service";
import { S3Service } from "./services/s3.service";
import { SesService } from "./services/ses.service";
import { SqsService } from "./services/sqs.service";

@Injectable()
export class AwsxService {
  constructor(
    @Inject(AwsxToken.S3Service)
    public readonly s3: S3Service,
    @Inject(AwsxToken.SqsService)
    public readonly sqs: SqsService,
    @Inject(AwsxToken.SesService)
    public readonly ses: SesService,
    @Inject(AwsxToken.Route53Service)
    public readonly route53: Route53Service,
  ) {}
}
