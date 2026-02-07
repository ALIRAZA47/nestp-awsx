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
  type CompleteMultipartUploadCommandOutput,
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
import { Upload } from "@aws-sdk/lib-storage";
import { AwsxToken } from "../constants";
import { AwsxS3SignedUrlOperation, AwsxServiceKey, type AwsxNormalizedConfig } from "../types";
import { toBuffer } from "../utils";

type S3Input<T> = Omit<T, "Bucket"> & { Bucket?: string };

@Injectable()
export class S3Service {
  private readonly defaultBucket?: string;

  constructor(
    @Inject(AwsxToken.S3Client)
    private readonly client: S3Client,
    @Inject(AwsxToken.Config)
    config: AwsxNormalizedConfig,
  ) {
    this.defaultBucket = config.services[AwsxServiceKey.S3]?.defaultBucket;
  }

  private resolveBucket(bucket?: string): string {
    const resolved = bucket ?? this.defaultBucket;
    if (!resolved) {
      throw new Error("[awsx] S3 bucket is required. Provide Bucket or defaultBucket.");
    }
    return resolved;
  }

  private withBucket<T extends { Bucket?: string }>(params: T): T & { Bucket: string } {
    return { ...params, Bucket: this.resolveBucket(params.Bucket) };
  }

  async putObject(params: S3Input<PutObjectCommandInput>): Promise<PutObjectCommandOutput> {
    return this.client.send(new PutObjectCommand(this.withBucket(params)));
  }

  async getObject(
    params: S3Input<GetObjectCommandInput>,
  ): Promise<GetObjectCommandOutput & { body: Buffer }> {
    const result = await this.client.send(new GetObjectCommand(this.withBucket(params)));
    const body = await toBuffer(result.Body);
    return { ...result, body };
  }

  async deleteObject(params: S3Input<DeleteObjectCommandInput>) {
    return this.client.send(new DeleteObjectCommand(this.withBucket(params)));
  }

  async listObjects(
    params: S3Input<ListObjectsV2CommandInput>,
  ): Promise<ListObjectsV2CommandOutput> {
    return this.client.send(new ListObjectsV2Command(this.withBucket(params)));
  }

  async listKeys(params: S3Input<ListObjectsV2CommandInput>): Promise<string[]> {
    const result = await this.listObjects(params);
    return (result.Contents ?? [])
      .map((item) => item.Key)
      .filter((key): key is string => Boolean(key));
  }

  async exists(params: S3Input<HeadObjectCommandInput>): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand(this.withBucket(params)));
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
    options?: Omit<PutObjectCommandInput, "Bucket" | "Key" | "Body" | "ContentType">,
  ): Promise<PutObjectCommandOutput>;
  async putJson(params: {
    bucket?: string;
    key: string;
    data: unknown;
    options?: Omit<PutObjectCommandInput, "Bucket" | "Key" | "Body" | "ContentType">;
  }): Promise<PutObjectCommandOutput>;
  async putJson(
    bucketOrParams: string | { bucket?: string; key: string; data: unknown; options?: any },
    key?: string,
    data?: unknown,
    options?: Omit<PutObjectCommandInput, "Bucket" | "Key" | "Body" | "ContentType">,
  ): Promise<PutObjectCommandOutput> {
    if (typeof bucketOrParams === "string") {
      return this.putObject({
        Bucket: this.resolveBucket(bucketOrParams),
        Key: key!,
        Body: JSON.stringify(data),
        ContentType: "application/json",
        ...options,
      });
    }

    const { bucket, key: objectKey, data: payload, options: opts } = bucketOrParams;
    return this.putObject({
      Bucket: this.resolveBucket(bucket),
      Key: objectKey,
      Body: JSON.stringify(payload),
      ContentType: "application/json",
      ...opts,
    });
  }

  async getJson<T = unknown>(params: S3Input<GetObjectCommandInput>): Promise<T> {
    const result = await this.getObject(params);
    const text = result.body.toString("utf-8");
    return JSON.parse(text) as T;
  }

  async getSignedUrl(
    params:
      | {
          operation: AwsxS3SignedUrlOperation.GetObject;
          input: S3Input<GetObjectCommandInput>;
          expiresIn?: number;
        }
      | {
          operation: AwsxS3SignedUrlOperation.PutObject;
          input: S3Input<PutObjectCommandInput>;
          expiresIn?: number;
        },
  ): Promise<string> {
    const input = this.withBucket(params.input);
    const command =
      params.operation === AwsxS3SignedUrlOperation.GetObject
        ? new GetObjectCommand(input)
        : new PutObjectCommand(input);
    return getSignedUrl(this.client, command, { expiresIn: params.expiresIn ?? 900 });
  }

  async deleteMany(
    params: S3Input<DeleteObjectsCommandInput>,
  ): Promise<DeleteObjectsCommandOutput> {
    return this.client.send(new DeleteObjectsCommand(this.withBucket(params)));
  }

  async putMany(
    items: S3Input<PutObjectCommandInput>[],
    options: { concurrency?: number } = {},
  ): Promise<{
    successes: Array<{ index: number; input: S3Input<PutObjectCommandInput>; output: PutObjectCommandOutput }>;
    failures: Array<{ index: number; input: S3Input<PutObjectCommandInput>; error: unknown }>;
  }> {
    const concurrency = options.concurrency ?? 4;
    const successes: Array<{
      index: number;
      input: S3Input<PutObjectCommandInput>;
      output: PutObjectCommandOutput;
    }> = [];
    const failures: Array<{ index: number; input: S3Input<PutObjectCommandInput>; error: unknown }> = [];
    let index = 0;

    const worker = async () => {
      while (index < items.length) {
        const currentIndex = index;
        const input = items[currentIndex];
        index += 1;
        try {
          const output = await this.putObject(input);
          successes.push({ index: currentIndex, input, output });
        } catch (error) {
          failures.push({ index: currentIndex, input, error });
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
    return { successes, failures };
  }

  async uploadWithProgress(params: {
    input: S3Input<PutObjectCommandInput>;
    onProgress?: (progress: { loaded?: number; total?: number; part?: number }) => void;
    queueSize?: number;
    partSize?: number;
    leavePartsOnError?: boolean;
  }): Promise<CompleteMultipartUploadCommandOutput> {
    const upload = new Upload({
      client: this.client,
      params: this.withBucket(params.input),
      queueSize: params.queueSize,
      partSize: params.partSize,
      leavePartsOnError: params.leavePartsOnError,
    });

    if (params.onProgress) {
      upload.on("httpUploadProgress", params.onProgress);
    }

    return upload.done() as Promise<CompleteMultipartUploadCommandOutput>;
  }
}
