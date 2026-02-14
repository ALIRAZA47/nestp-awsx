import { Module } from "@nestjs/common";
import { AwsxCredentialSource, AwsxModule } from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      global: {
        source: AwsxCredentialSource.Static,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
        region: "us-east-1",
      },
    }),
  ],
})
export class AwsStaticCredentialsModule {}
