import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  AwsxCredentialSource,
  AwsxModule,
  AwsxServiceKey,
} from "@nestp/awsx";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AwsxModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaults: {
          region: config.get<string>("AWS_REGION") ?? "us-east-1",
        },
        global: {
          source: AwsxCredentialSource.Profile,
          profile: config.get<string>("AWS_PROFILE") ?? "default",
        },
        services: {
          [AwsxServiceKey.S3]: {
            defaultBucket: config.get<string>("AWS_S3_BUCKET") ?? "app-assets",
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
