import { Module } from "@nestjs/common";
import { AwsxCredentialSource, AwsxModule } from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      global: {
        source: AwsxCredentialSource.Profile,
        profile: "production",
        region: "us-east-1",
      },
    }),
  ],
})
export class AwsProfileCredentialsModule {}
