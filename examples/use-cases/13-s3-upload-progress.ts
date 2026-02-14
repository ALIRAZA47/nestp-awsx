import { createReadStream } from "node:fs";
import { Injectable } from "@nestjs/common";
import { S3Service } from "@nestp/awsx";

@Injectable()
export class S3ProgressUploadExampleService {
  constructor(private readonly s3: S3Service) {}

  async uploadLargeVideo() {
    const stream = createReadStream("./large-video.mp4");

    return this.s3.uploadWithProgress({
      input: {
        Bucket: "app-assets",
        Key: "videos/large-video.mp4",
        Body: stream,
      },
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
      onProgress: ({ loaded, total, part }) => {
        console.log({ loaded, total, part });
      },
    });
  }
}
