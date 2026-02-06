# Basic Example

Minimal NestJS usage with one client per service.

## Example Config

`awsx.config.json` is included in this folder for a basic S3 setup.

## App Module

```ts
import { Module } from "@nestjs/common";
import {
  AwsxCredentialSource,
  AwsxModule,
  AwsxServiceKey,
} from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      defaults: { region: "us-east-1" },
      global: { source: AwsxCredentialSource.Default },
      services: {
        [AwsxServiceKey.S3]: {},
      },
    }),
  ],
})
export class AppModule {}
```

## Service Usage

```ts
import { Injectable } from "@nestjs/common";
import { AwsxService } from "@nestp/awsx";

@Injectable()
export class UploadService {
  constructor(private readonly awsx: AwsxService) {}

  async uploadSample() {
    return this.awsx.s3.putObject({
      Bucket: "my-bucket",
      Key: "sample.json",
      Body: JSON.stringify({ ok: true }),
    });
  }
}
```
