import { Module } from "@nestjs/common";
import { AwsxCredentialSource, AwsxModule } from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      global: {
        source: AwsxCredentialSource.Default,
      },
    }),
  ],
})
export class AwsDefaultCredentialsModule {}
