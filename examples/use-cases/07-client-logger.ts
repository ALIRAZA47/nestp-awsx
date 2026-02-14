import { Module } from "@nestjs/common";
import { AwsxConsoleLogger, AwsxModule } from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      defaults: {
        region: "us-east-1",
        enableLogger: true,
        logger: new AwsxConsoleLogger(),
      },
    }),
  ],
})
export class AwsLoggerModule {}
