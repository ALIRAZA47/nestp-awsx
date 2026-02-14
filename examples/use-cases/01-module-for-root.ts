import { Module } from "@nestjs/common";
import {
  AwsxCredentialSource,
  AwsxModule,
  AwsxServiceKey,
} from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      defaults: {
        region: "us-east-1",
        maxAttempts: 3,
      },
      global: {
        source: AwsxCredentialSource.Default,
      },
      services: {
        [AwsxServiceKey.S3]: {
          defaultBucket: "app-assets",
        },
        [AwsxServiceKey.Sqs]: {},
        [AwsxServiceKey.Ses]: {},
        [AwsxServiceKey.Route53]: {},
      },
    }),
  ],
})
export class AppModule {}
