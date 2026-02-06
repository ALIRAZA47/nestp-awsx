import { DynamicModule, Module, Provider } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import { SESClient } from "@aws-sdk/client-ses";
import { Route53Client } from "@aws-sdk/client-route-53";
import { AwsxToken } from "./constants";
import { createClient } from "./clients";
import { normalizeConfig } from "./normalize";
import {
  AwsxServiceKey,
  type AwsxAsyncOptions,
  type AwsxConfig,
  type AwsxConfigFactory,
  type AwsxNormalizedConfig,
} from "./types";
import { AwsxService } from "./awsx.service";
import { Route53Service } from "./services/route53.service";
import { S3Service } from "./services/s3.service";
import { SesService } from "./services/ses.service";
import { SqsService } from "./services/sqs.service";

@Module({})
export class AwsxModule {
  static forRoot(config: AwsxConfig): DynamicModule {
    const normalized = normalizeConfig(config);

    return {
      module: AwsxModule,
      providers: [
        {
          provide: AwsxToken.Config,
          useValue: normalized,
        },
        ...AwsxModule.createClientProviders(),
        ...AwsxModule.createServiceProviders(),
      ],
      exports: AwsxModule.exportedProviders(),
    };
  }

  static forRootAsync(options: AwsxAsyncOptions): DynamicModule {
    const asyncProviders = AwsxModule.createAsyncProviders(options);

    return {
      module: AwsxModule,
      imports: options.imports ?? [],
      providers: [
        ...asyncProviders,
        ...AwsxModule.createClientProviders(),
        ...AwsxModule.createServiceProviders(),
      ],
      exports: AwsxModule.exportedProviders(),
    };
  }

  private static createAsyncProviders(options: AwsxAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: AwsxToken.Config,
          useFactory: async (...args: any[]) =>
            normalizeConfig(await options.useFactory!(...args)),
          inject: options.inject ?? [],
        },
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
        {
          provide: AwsxToken.Config,
          useFactory: async (factory: AwsxConfigFactory) =>
            normalizeConfig(await factory.createAwsxConfig()),
          inject: [options.useClass],
        },
      ];
    }

    throw new Error("[awsx] Invalid async configuration. Provide useFactory or useClass.");
  }

  private static createClientProviders(): Provider[] {
    return [
      {
        provide: AwsxToken.S3Client,
        useFactory: (config: AwsxNormalizedConfig) =>
          createClient(config.services[AwsxServiceKey.S3], S3Client),
        inject: [AwsxToken.Config],
      },
      {
        provide: AwsxToken.SqsClient,
        useFactory: (config: AwsxNormalizedConfig) =>
          createClient(config.services[AwsxServiceKey.Sqs], SQSClient),
        inject: [AwsxToken.Config],
      },
      {
        provide: AwsxToken.SesClient,
        useFactory: (config: AwsxNormalizedConfig) =>
          createClient(config.services[AwsxServiceKey.Ses], SESClient),
        inject: [AwsxToken.Config],
      },
      {
        provide: AwsxToken.Route53Client,
        useFactory: (config: AwsxNormalizedConfig) =>
          createClient(config.services[AwsxServiceKey.Route53], Route53Client),
        inject: [AwsxToken.Config],
      },
    ];
  }

  private static createServiceProviders(): Provider[] {
    return [
      {
        provide: AwsxToken.S3Service,
        useClass: S3Service,
      },
      {
        provide: AwsxToken.SqsService,
        useClass: SqsService,
      },
      {
        provide: AwsxToken.SesService,
        useClass: SesService,
      },
      {
        provide: AwsxToken.Route53Service,
        useClass: Route53Service,
      },
      AwsxService,
    ];
  }

  private static exportedProviders(): Array<Provider | AwsxToken> {
    return [
      AwsxToken.Config,
      AwsxToken.S3Client,
      AwsxToken.SqsClient,
      AwsxToken.SesClient,
      AwsxToken.Route53Client,
      AwsxToken.S3Service,
      AwsxToken.SqsService,
      AwsxToken.SesService,
      AwsxToken.Route53Service,
      AwsxService,
    ];
  }
}
