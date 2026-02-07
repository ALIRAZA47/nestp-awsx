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
  s3DefaultBucket: `import { AwsxServiceKey } from "@nestp/awsx";

const config = {
  services: {
    [AwsxServiceKey.S3]: {
      defaultBucket: "my-bucket"
    }
  }
};`,
  loggerConfig: `import { AwsxConsoleLogger } from "@nestp/awsx";

const config = {
  defaults: {
    region: "us-east-1",
    enableLogger: true,
    logger: new AwsxConsoleLogger()
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
  s3Helpers: `await this.awsx.s3.putJson(
  "my-bucket",
  "report.json",
  { ok: true }
);

const keys = await this.awsx.s3.listKeys({ Bucket: "my-bucket" });
const exists = await this.awsx.s3.exists({ Bucket: "my-bucket", Key: "report.json" });
const data = await this.awsx.s3.getJson<{ ok: boolean }>({
  Bucket: "my-bucket",
  Key: "report.json"
});`,
  s3SignedUrl: `import { AwsxS3SignedUrlOperation } from "@nestp/awsx";

const url = await this.awsx.s3.getSignedUrl({
  operation: AwsxS3SignedUrlOperation.GetObject,
  input: { Bucket: "my-bucket", Key: "report.json" },
  expiresIn: 900
});`,
  s3PutMany: `const result = await this.awsx.s3.putMany(
  [
    { Bucket: "my-bucket", Key: "a.json", Body: "{\\"ok\\":true}" },
    { Bucket: "my-bucket", Key: "b.json", Body: "{\\"ok\\":false}" }
  ],
  { concurrency: 3 }
);

if (result.failures.length) {
  console.error("Failed uploads:", result.failures);
}`,
  s3Progress: `await this.awsx.s3.uploadWithProgress({
  input: {
    Bucket: "my-bucket",
    Key: "large-video.mp4",
    Body: fileStream
  },
  onProgress: (progress) => {
    console.log("Uploaded", progress.loaded, "of", progress.total);
  }
});`,
  sqs: `await this.awsx.sqs.sendMessage({
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
  MessageBody: "hello"
});`,
  sqsHelpers: `await this.awsx.sqs.sendJson(
  "https://sqs.us-east-1.amazonaws.com/123/queue",
  { type: "welcome", userId: "u_123" }
);

const messages = await this.awsx.sqs.receiveJson({
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
  MaxNumberOfMessages: 5
});`,
  sqsBatch: `await this.awsx.sqs.sendJsonBatch({
  queueUrl: "https://sqs.us-east-1.amazonaws.com/123/queue",
  entries: [
    { body: { type: "welcome", userId: "u_1" } },
    { body: { type: "welcome", userId: "u_2" } }
  ]
});`,
  ses: `await this.awsx.ses.sendEmail({
  Source: "team@company.com",
  Destination: { ToAddresses: ["user@company.com"] },
  Message: {
    Subject: { Data: "Welcome" },
    Body: { Text: { Data: "Hello there" } }
  }
});`,
  sesHelpers: `await this.awsx.ses.sendTextEmail({
  from: "team@company.com",
  to: ["user@company.com"],
  subject: "Welcome",
  text: "Hello there"
});

await this.awsx.ses.sendHtmlEmail({
  from: "team@company.com",
  to: ["user@company.com"],
  subject: "Welcome",
  html: "<h1>Hello</h1><p>Glad you're here.</p>",
  textFallback: "Hello. Glad you're here."
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
  route53Helpers: `await this.awsx.route53.upsertARecord({
  zoneId: "Z123",
  name: "api.example.com",
  values: ["203.0.113.10"],
  ttl: 60
});

await this.awsx.route53.upsertTxtRecord({
  zoneId: "Z123",
  name: "acme-challenge.example.com",
  values: ["\\"token-value\\""],
  ttl: 300
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
  exampleFiles: `examples/\n  basic/\n    package.json\n    tsconfig.json\n    src/\n      app.module.ts\n      app.service.ts\n      app.controller.ts\n      main.ts\n  async-config/\n    package.json\n    tsconfig.json\n    src/\n      app.module.ts\n      app.service.ts\n      app.controller.ts\n      main.ts`,
};
