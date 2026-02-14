import { Injectable } from "@nestjs/common";
import { S3Service } from "@nestp/awsx";

@Injectable()
export class S3HelperExampleService {
  constructor(private readonly s3: S3Service) {}

  async runHelpers() {
    await this.s3.putJson({
      bucket: "app-assets",
      key: "settings.json",
      data: { darkMode: true },
    });

    const settings = await this.s3.getJson<{ darkMode: boolean }>({
      Bucket: "app-assets",
      Key: "settings.json",
    });

    const exists = await this.s3.exists({ Bucket: "app-assets", Key: "settings.json" });
    const keys = await this.s3.listKeys({ Bucket: "app-assets", Prefix: "" });

    await this.s3.deleteMany({
      Bucket: "app-assets",
      Delete: {
        Objects: [{ Key: "settings.json" }],
        Quiet: true,
      },
    });

    return { settings, exists, keys };
  }
}
