import { Readable } from "stream";

export const toBuffer = async (body: unknown): Promise<Buffer> => {
  if (!body) {
    return Buffer.alloc(0);
  }

  if (Buffer.isBuffer(body)) {
    return body;
  }

  if (body instanceof Uint8Array) {
    return Buffer.from(body);
  }

  if (typeof body === "string") {
    return Buffer.from(body);
  }

  const maybeReadable = body as Readable;
  if (typeof maybeReadable?.on === "function") {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      maybeReadable.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      maybeReadable.on("end", () => resolve(Buffer.concat(chunks)));
      maybeReadable.on("error", reject);
    });
  }

  const asAny = body as { transformToByteArray?: () => Promise<Uint8Array> };
  if (typeof asAny?.transformToByteArray === "function") {
    const bytes = await asAny.transformToByteArray();
    return Buffer.from(bytes);
  }

  throw new Error("[awsx] Unsupported body type");
};
