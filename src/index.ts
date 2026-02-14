export { AwsxModule } from "./awsx.module";
export { AwsxService } from "./awsx.service";
export { AwsxToken } from "./constants";
export {
  AwsxCredentialSource,
  AwsxRoute53ChangeAction,
  AwsxRoute53RecordType,
  AwsxServiceKey,
  AwsxS3SignedUrlOperation,
} from "./types";
export { AwsxConsoleLogger } from "./logger";
export { S3Service } from "./services/s3.service";
export { SqsService } from "./services/sqs.service";
export { SesService } from "./services/ses.service";
export { Route53Service } from "./services/route53.service";
export type {
  AwsxAsyncOptions,
  AwsxConfig,
  AwsxConfigFactory,
  AwsxCredentialConfig,
  AwsxDefaults,
  AwsxServiceConfig,
} from "./types";
