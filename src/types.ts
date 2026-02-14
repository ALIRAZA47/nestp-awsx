import type { ModuleMetadata, Type } from "@nestjs/common";
import type { Logger } from "@aws-sdk/types";

export enum AwsxServiceKey {
  S3 = "s3",
  Sqs = "sqs",
  Ses = "ses",
  Route53 = "route53",
}

export enum AwsxCredentialSource {
  Default = "default",
  Profile = "profile",
  Static = "static",
}

export enum AwsxS3SignedUrlOperation {
  GetObject = "getObject",
  PutObject = "putObject",
}

export enum AwsxRoute53ChangeAction {
  Create = "CREATE",
  Delete = "DELETE",
  Upsert = "UPSERT",
}

export enum AwsxRoute53RecordType {
  A = "A",
  Txt = "TXT",
}

export type AwsxCredentialConfig = {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  profile?: string;
  source?: AwsxCredentialSource;
};

export type AwsxServiceConfig = {
  region?: string;
  endpoint?: string;
  defaultBucket?: string;
  credentials?: AwsxCredentialConfig;
  client?: Record<string, unknown>;
};

export type AwsxDefaults = {
  region?: string;
  maxAttempts?: number;
  enableLogger?: boolean;
  logger?: Logger;
};

export type AwsxConfig = {
  global?: AwsxCredentialConfig;
  defaults?: AwsxDefaults;
  services?: {
    [AwsxServiceKey.S3]?: AwsxServiceConfig;
    [AwsxServiceKey.Sqs]?: AwsxServiceConfig;
    [AwsxServiceKey.Ses]?: AwsxServiceConfig;
    [AwsxServiceKey.Route53]?: AwsxServiceConfig;
  };
};

export type AwsxServiceConfigNormalized = {
  region?: string;
  endpoint?: string;
  defaultBucket?: string;
  client: Record<string, unknown>;
  credentials: AwsxCredentialConfig;
};

export type AwsxNormalizedConfig = {
  defaults: AwsxDefaults;
  global: AwsxCredentialConfig;
  services: {
    [AwsxServiceKey.S3]: AwsxServiceConfigNormalized;
    [AwsxServiceKey.Sqs]: AwsxServiceConfigNormalized;
    [AwsxServiceKey.Ses]: AwsxServiceConfigNormalized;
    [AwsxServiceKey.Route53]: AwsxServiceConfigNormalized;
  };
};

export interface AwsxConfigFactory {
  createAwsxConfig(): AwsxConfig | Promise<AwsxConfig>;
}

export type AwsxAsyncOptions = Pick<ModuleMetadata, "imports"> & {
  inject?: any[];
  useFactory?: (...args: any[]) => AwsxConfig | Promise<AwsxConfig>;
  useClass?: Type<AwsxConfigFactory>;
};
