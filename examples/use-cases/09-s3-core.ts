import { Injectable } from "@nestjs/common";
import { S3Service } from "@nestp/awsx";

@Injectable()
export class S3CoreExampleService {
  constructor(private readonly s3: S3Service) {}

  async replaceConfigFile() {
    await this.s3.putObject({ Bucket: "app-assets", Key: "data.json", Body: "{}" });

    const object = await this.s3.getObject({ Bucket: "app-assets", Key: "data.json" });

    await this.s3.listObjects({ Bucket: "app-assets", Prefix: "data/" });
    await this.s3.deleteObject({ Bucket: "app-assets", Key: "data.json" });

    return object.body.toString("utf-8");
  }
}
