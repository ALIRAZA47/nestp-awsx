import { Module } from "@nestjs/common";
import { AwsxCredentialSource, AwsxModule, AwsxServiceKey } from "@nestp/awsx";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    AwsxModule.forRoot({
      defaults: { region: "us-east-1" },
      global: { source: AwsxCredentialSource.Default },
      services: {
        [AwsxServiceKey.S3]: {},
        [AwsxServiceKey.Sqs]: {},
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
