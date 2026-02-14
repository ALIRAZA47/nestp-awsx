import { Inject, Injectable, Module } from "@nestjs/common";
import { AwsxModule, AwsxToken, S3Service } from "@nestp/awsx";

@Injectable()
class CustomS3Service extends S3Service {
  async putObject(params: Parameters<S3Service["putObject"]>[0]) {
    console.log("[custom-s3] uploading", params.Key);
    return super.putObject(params);
  }
}

@Injectable()
class UploadService {
  constructor(@Inject(AwsxToken.S3Service) private readonly s3: S3Service) {}

  upload() {
    return this.s3.putObject({ Bucket: "app-assets", Key: "custom.txt", Body: "ok" });
  }
}

@Module({
  imports: [AwsxModule.forRoot({})],
  providers: [
    UploadService,
    {
      provide: AwsxToken.S3Service,
      useClass: CustomS3Service,
    },
  ],
})
export class AppModule {}
