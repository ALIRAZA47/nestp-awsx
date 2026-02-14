import { Injectable } from "@nestjs/common";
import { S3Service } from "@nestp/awsx";

@Injectable()
export class S3BulkUploadExampleService {
  constructor(private readonly s3: S3Service) {}

  async uploadManyObjects() {
    const result = await this.s3.putMany(
      [
        { Bucket: "app-assets", Key: "bulk/a.json", Body: "{}" },
        { Bucket: "app-assets", Key: "bulk/b.json", Body: "{}" },
        { Bucket: "app-assets", Key: "bulk/c.json", Body: "{}" },
      ],
      { concurrency: 3 },
    );

    if (result.failures.length > 0) {
      result.failures.forEach((item) => {
        console.error(`Upload failed at index ${item.index}`, item.error);
      });
    }

    return result;
  }
}
