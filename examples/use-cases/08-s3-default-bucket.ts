import { Injectable, Module } from "@nestjs/common";
import { AwsxModule, AwsxServiceKey, S3Service } from "@nestp/awsx";

@Injectable()
export class AvatarStorageService {
  constructor(private readonly s3: S3Service) {}

  async uploadAvatar(userId: string, avatarBody: Buffer) {
    return this.s3.putObject({
      Key: `avatars/${userId}.png`,
      Body: avatarBody,
    });
  }
}

@Module({
  imports: [
    AwsxModule.forRoot({
      services: {
        [AwsxServiceKey.S3]: {
          defaultBucket: "app-assets",
        },
      },
    }),
  ],
  providers: [AvatarStorageService],
  exports: [AvatarStorageService],
})
export class AssetsModule {}
