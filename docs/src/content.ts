export const codeSamples = {
  quickStart: `import { Module } from "@nestjs/common";
import { AwsxCredentialSource, AwsxModule } from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      defaults: { region: "us-east-1" },
      global: { source: AwsxCredentialSource.Default }
    })
  ]
})
export class AppModule {}`,
  asyncConfig: `import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AwsxCredentialSource, AwsxModule } from "@nestp/awsx";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AwsxModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaults: { region: config.get("AWS_REGION") ?? "us-east-1" },
        global: {
          source: AwsxCredentialSource.Profile,
          profile: config.get("AWS_PROFILE") ?? "default"
        }
      })
    })
  ]
})
export class AppModule {}`,
  configJson: `{
  "defaults": { "region": "us-east-1" },
  "global": { "source": "default" },
  "services": {
    "s3": {},
    "sqs": {
      "region": "us-west-2",
      "credentials": { "profile": "prod", "source": "profile" }
    }
  }
}`,
  configTs: `import { AwsxCredentialSource, AwsxServiceKey } from "@nestp/awsx";

export const config = {
  defaults: { region: "us-east-1" },
  services: {
    [AwsxServiceKey.S3]: {
      credentials: { source: AwsxCredentialSource.Profile, profile: "prod" }
    }
  }
};`,
  credentialSources: `const defaultCreds = { source: "default" };
const profileCreds = { source: "profile", profile: "prod" };
const staticCreds = {
  source: "static",
  accessKeyId: "AKIA...",
  secretAccessKey: "...",
  sessionToken: "..." // optional
};`,
  credentialManager: `AwsxModule.forRootAsync({
  useFactory: async () => {
    const creds = await loadCredentialsFromManager();
    return {
      global: {
        source: "static",
        accessKeyId: creds.accessKeyId,
        secretAccessKey: creds.secretAccessKey,
        sessionToken: creds.sessionToken
      }
    };
  }
});`,
  awsxService: `import { Injectable } from "@nestjs/common";
import { AwsxService } from "@nestp/awsx";

@Injectable()
export class UploadService {
  constructor(private readonly awsx: AwsxService) {}

  async uploadSample() {
    return this.awsx.s3.putObject({
      Bucket: "my-bucket",
      Key: "sample.json",
      Body: JSON.stringify({ ok: true })
    });
  }
}`,
  s3: `await this.awsx.s3.putObject({
  Bucket: "my-bucket",
  Key: "report.json",
  Body: JSON.stringify({ ok: true })
});`,
  sqs: `await this.awsx.sqs.sendMessage({
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
  MessageBody: "hello"
});`,
  ses: `await this.awsx.ses.sendEmail({
  Source: "team@company.com",
  Destination: { ToAddresses: ["user@company.com"] },
  Message: {
    Subject: { Data: "Welcome" },
    Body: { Text: { Data: "Hello there" } }
  }
});`,
  route53: `await this.awsx.route53.changeRecordSets({
  HostedZoneId: "Z123",
  ChangeBatch: {
    Changes: [
      {
        Action: "UPSERT",
        ResourceRecordSet: {
          Name: "api.example.com",
          Type: "A",
          TTL: 60,
          ResourceRecords: [{ Value: "203.0.113.10" }]
        }
      }
    ]
  }
});`,
  injectClient: `import { Inject } from "@nestjs/common";
import { AwsxToken } from "@nestp/awsx";
import type { S3Client } from "@aws-sdk/client-s3";

constructor(@Inject(AwsxToken.S3Client) private readonly client: S3Client) {}`,
  injectService: `import { Injectable } from "@nestjs/common";
import { S3Service } from "@nestp/awsx";

@Injectable()
export class UploadService {
  constructor(private readonly s3: S3Service) {}
}`,
  overrideService: `import { Module } from "@nestjs/common";
import { AwsxModule, AwsxToken } from "@nestp/awsx";
import { CustomS3Service } from "./custom-s3.service";

@Module({
  imports: [AwsxModule.forRoot({ defaults: { region: "us-east-1" } })],
  providers: [{ provide: AwsxToken.S3Service, useClass: CustomS3Service }]
})
export class AppModule {}`,
  cli: `npx @nestp/awsx setup
npx @nestp/awsx init
npx @nestp/awsx install`,
  exampleConfig: `{
  "defaults": { "region": "us-east-1" },
  "global": { "source": "default" },
  "services": { "s3": {} }
}`,
};
