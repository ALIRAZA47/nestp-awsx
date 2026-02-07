# @nestp/awsx

A one-stop NestJS module for AWS integrations with S3, SQS, SES, and Route53 with one client per service. Includes a CLI to scaffold config and install the package.

## Install

```bash
npm install @nestp/awsx
```

## Quick Start

```ts
import { Module } from "@nestjs/common";
import { AwsxModule, AwsxCredentialSource } from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      defaults: { region: "us-east-1" },
      global: { profile: "default", source: AwsxCredentialSource.Profile },
    }),
  ],
})
export class AppModule {}
```

### Using ConfigService

```ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AwsxModule } from "@nestp/awsx";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AwsxModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaults: { region: config.get<string>("AWS_REGION") ?? "us-east-1" },
        global: { profile: config.get<string>("AWS_PROFILE") ?? "default" },
      }),
    }),
  ],
})
export class AppModule {}
```

## Config

### Global credentials (one for all services)

```json
{
  "defaults": { "region": "us-east-1" },
  "global": {
    "profile": "default",
    "source": "profile"
  }
}
```

### Client logger

```ts
import { AwsxConsoleLogger } from "@nestp/awsx";

AwsxModule.forRoot({
  defaults: {
    enableLogger: true,
    logger: new AwsxConsoleLogger(),
  },
});
```

### Default S3 bucket

```ts
import { AwsxServiceKey } from "@nestp/awsx";

AwsxModule.forRoot({
  services: {
    [AwsxServiceKey.S3]: {
      defaultBucket: "my-bucket",
    },
  },
});
```

### Credential sources

- `default`: AWS default chain (env vars, shared config/credentials files, ECS/EC2 metadata).
- `profile`: Use a profile from shared config/credentials files.
- `static`: Use `accessKeyId` and `secretAccessKey` directly.

### Per-service credentials

```json
{
  "defaults": { "region": "us-east-1" },
  "services": {
    "s3": {
      "credentials": { "profile": "prod", "source": "profile" }
    },
    "sqs": {
      "region": "us-west-2",
      "credentials": { "accessKeyId": "AKIA...", "secretAccessKey": "...", "source": "static" }
    }
  }
}
```

```ts
import { AwsxCredentialSource, AwsxServiceKey } from "@nestp/awsx";

const config = {
  services: {
    [AwsxServiceKey.S3]: {
      credentials: { source: AwsxCredentialSource.Profile, profile: "prod" },
    },
  },
};
```

### Signed URLs

```ts
import { AwsxS3SignedUrlOperation } from "@nestp/awsx";

const url = await awsx.s3.getSignedUrl({
  operation: AwsxS3SignedUrlOperation.GetObject,
  input: { Bucket: "my-bucket", Key: "report.json" },
  expiresIn: 900,
});
```

### Upload many (failsafe)

```ts
const result = await awsx.s3.putMany(
  [
    { Bucket: "my-bucket", Key: "a.json", Body: "{\"ok\":true}" },
    { Bucket: "my-bucket", Key: "b.json", Body: "{\"ok\":false}" },
  ],
  { concurrency: 3 },
);

if (result.failures.length) {
  console.error("Failed uploads:", result.failures);
}
```

### Upload with progress

```ts
await awsx.s3.uploadWithProgress({
  input: { Bucket: "my-bucket", Key: "large-video.mp4", Body: fileStream },
  onProgress: (progress) => {
    console.log("Uploaded", progress.loaded, "of", progress.total);
  },
});
```

## Using Services

```ts
import { Injectable } from "@nestjs/common";
import { AwsxService } from "@nestp/awsx";

@Injectable()
export class ReportService {
  constructor(private readonly awsx: AwsxService) {}

  async upload() {
    return this.awsx.s3.putObject({
      Bucket: "my-bucket",
      Key: "report.json",
      Body: JSON.stringify({ ok: true }),
    });
  }
}
```

### Use a single service directly

```ts
import { Injectable } from "@nestjs/common";
import { S3Service } from "@nestp/awsx";

@Injectable()
export class UploadService {
  constructor(private readonly s3: S3Service) {}
}
```

### Inject a raw client

```ts
import { Inject } from "@nestjs/common";
import { AwsxToken } from "@nestp/awsx";
import type { S3Client } from "@aws-sdk/client-s3";

constructor(@Inject(AwsxToken.S3Client) private readonly client: S3Client) {}
```

## Extending / Overriding

Override any service by providing the injection token in your module:

```ts
import { Module } from "@nestjs/common";
import { AwsxModule, AwsxToken } from "@nestp/awsx";
import { CustomS3Service } from "./custom-s3.service";

@Module({
  imports: [AwsxModule.forRoot({ defaults: { region: "us-east-1" } })],
  providers: [{ provide: AwsxToken.S3Service, useClass: CustomS3Service }],
})
export class AppModule {}
```

## CLI

Run an interactive setup that installs the package and generates `awsx.config.json`:

```bash
npx @nestp/awsx setup
```

Other commands:

```bash
npx @nestp/awsx install
npx @nestp/awsx init
```

## Docs App

The docs live in `/docs` and are powered by Vite + React:

```bash
cd docs
npm install
npm run dev
```

## Notes

- If no region is provided, AWS SDK will use `AWS_REGION` or `AWS_DEFAULT_REGION` when available.
- If no explicit credentials are provided, the default AWS credential chain is used (env, ECS, EC2, shared config, etc.).
- Credentials can be sourced via `source: "default" | "profile" | "static"` or inferred from fields.
