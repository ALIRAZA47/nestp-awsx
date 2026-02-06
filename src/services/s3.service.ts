import { Inject, Injectable } from "@nestjs/common";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type DeleteObjectsCommandInput,
  type DeleteObjectsCommandOutput,
  type DeleteObjectCommandInput,
  type GetObjectCommandInput,
  type GetObjectCommandOutput,
  type HeadObjectCommandInput,
  type ListObjectsV2CommandInput,
  type ListObjectsV2CommandOutput,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

  async listKeys(params: ListObjectsV2CommandInput): Promise<string[]> {
    const result = await this.listObjects(params);
    return (result.Contents ?? [])
      .map((item) => item.Key)
      .filter((key): key is string => Boolean(key));
  }

  async exists(params: HeadObjectCommandInput): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand(params));
      return true;
    } catch (error: any) {
      const code = error?.name ?? error?.Code ?? error?.code;
      if (code === "NotFound" || code === "NoSuchKey") {
        return false;
      }
      throw error;
    }
  }

  async putJson(
    bucket: string,
    key: string,
    data: unknown,
    options: Omit<PutObjectCommandInput, "Bucket" | "Key" | "Body" | "ContentType"> = {},
  ): Promise<PutObjectCommandOutput> {
    return this.putObject({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: "application/json",
      ...options,
    });
  }

  async getJson<T = unknown>(params: GetObjectCommandInput): Promise<T> {
    const result = await this.getObject(params);
    const text = result.body.toString("utf-8");
    return JSON.parse(text) as T;
  }

  async getSignedUrl(
    params:
      | { operation: "getObject"; input: GetObjectCommandInput; expiresIn?: number }
      | { operation: "putObject"; input: PutObjectCommandInput; expiresIn?: number },
  ): Promise<string> {
    const command =
      params.operation === "getObject"
        ? new GetObjectCommand(params.input)
        : new PutObjectCommand(params.input);
    return getSignedUrl(this.client, command, { expiresIn: params.expiresIn ?? 900 });
  }

  async deleteMany(params: DeleteObjectsCommandInput): Promise<DeleteObjectsCommandOutput> {
    return this.client.send(new DeleteObjectsCommand(params));
  }

  async putMany(
    items: PutObjectCommandInput[],
    options: { concurrency?: number } = {},
  ): Promise<PutObjectCommandOutput[]> {
    const concurrency = options.concurrency ?? 4;
    const results: PutObjectCommandOutput[] = [];
    let index = 0;

    const worker = async () => {
      while (index < items.length) {
        const currentIndex = index;
        index += 1;
        const result = await this.putObject(items[currentIndex]);
        results[currentIndex] = result;
      }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
    return results;
  }
}
