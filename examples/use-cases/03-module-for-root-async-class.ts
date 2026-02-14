import { Injectable, Module } from "@nestjs/common";
import {
  AwsxConfig,
  AwsxConfigFactory,
  AwsxCredentialSource,
  AwsxModule,
  AwsxServiceKey,
} from "@nestp/awsx";

@Injectable()
class AwsxRuntimeConfigService implements AwsxConfigFactory {
  createAwsxConfig(): AwsxConfig {
    return {
      defaults: { region: process.env.AWS_REGION ?? "us-east-1" },
      global: {
        source: AwsxCredentialSource.Default,
      },
      services: {
        [AwsxServiceKey.S3]: { defaultBucket: process.env.AWS_S3_BUCKET ?? "app-assets" },
      },
    };
  }
}

@Module({
  imports: [
    AwsxModule.forRootAsync({
      useClass: AwsxRuntimeConfigService,
    }),
  ],
})
export class AppModule {}
