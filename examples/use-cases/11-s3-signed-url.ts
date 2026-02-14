import { Injectable } from "@nestjs/common";
import { AwsxS3SignedUrlOperation, S3Service } from "@nestp/awsx";

@Injectable()
export class S3SignedUrlExampleService {
  constructor(private readonly s3: S3Service) {}

  async createSignedUrls() {
    const downloadUrl = await this.s3.getSignedUrl({
      operation: AwsxS3SignedUrlOperation.GetObject,
      input: {
        Bucket: "app-assets",
        Key: "invoices/inv-001.pdf",
      },
      expiresIn: 900,
    });

    const uploadUrl = await this.s3.getSignedUrl({
      operation: AwsxS3SignedUrlOperation.PutObject,
      input: {
        Bucket: "app-assets",
        Key: "uploads/new-file.bin",
        ContentType: "application/octet-stream",
      },
      expiresIn: 600,
    });

    return { downloadUrl, uploadUrl };
  }
}
