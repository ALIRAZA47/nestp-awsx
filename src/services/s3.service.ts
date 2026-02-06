import { Inject, Injectable } from "@nestjs/common";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type DeleteObjectCommandInput,
  type GetObjectCommandInput,
  type GetObjectCommandOutput,
  type ListObjectsV2CommandInput,
  type ListObjectsV2CommandOutput,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { AwsxToken } from "../constants";
import { toBuffer } from "../utils";

@Injectable()
export class S3Service {
  constructor(
    @Inject(AwsxToken.S3Client)
    private readonly client: S3Client,
  ) {}

  async putObject(params: PutObjectCommandInput): Promise<PutObjectCommandOutput> {
    return this.client.send(new PutObjectCommand(params));
  }

  async getObject(params: GetObjectCommandInput): Promise<GetObjectCommandOutput & { body: Buffer }> {
    const result = await this.client.send(new GetObjectCommand(params));
    const body = await toBuffer(result.Body);
    return { ...result, body };
  }

  async deleteObject(params: DeleteObjectCommandInput) {
    return this.client.send(new DeleteObjectCommand(params));
  }

  async listObjects(params: ListObjectsV2CommandInput): Promise<ListObjectsV2CommandOutput> {
    return this.client.send(new ListObjectsV2Command(params));
  }
}
