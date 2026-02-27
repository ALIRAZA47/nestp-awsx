import { describe, it, expect } from "vitest";
import { normalizeConfig } from "./normalize";
import { AwsxServiceKey } from "./types";

describe("normalizeConfig", () => {
  it("returns normalized config with empty defaults when config is empty", () => {
    const result = normalizeConfig({});
    expect(result.defaults).toEqual({});
    expect(result.global).toEqual({});
    expect(result.services).toHaveProperty(AwsxServiceKey.S3);
    expect(result.services).toHaveProperty(AwsxServiceKey.Sqs);
    expect(result.services).toHaveProperty(AwsxServiceKey.Ses);
    expect(result.services).toHaveProperty(AwsxServiceKey.Route53);
  });

  it("merges global credentials into each service", () => {
    const config = {
      global: {
        region: "us-east-1",
        accessKeyId: "AKIA",
        secretAccessKey: "secret",
      },
    };
    const result = normalizeConfig(config);
    expect(result.global).toEqual(config.global);
    expect(result.services[AwsxServiceKey.S3].credentials).toEqual(config.global);
  });

  it("service credentials override global credentials", () => {
    const config = {
      global: { region: "us-east-1" },
      services: {
        [AwsxServiceKey.S3]: {
          credentials: { region: "eu-west-1" },
        },
      },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].credentials.region).toBe("eu-west-1");
  });

  it("service region takes precedence over global", () => {
    const config = {
      global: { region: "us-east-1" },
      services: {
        [AwsxServiceKey.S3]: { region: "ap-southeast-1" },
      },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].region).toBe("ap-southeast-1");
  });

  it("defaults.region is used when service and global have no region", () => {
    const config = {
      defaults: { region: "sa-east-1" },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].region).toBe("sa-east-1");
  });

  it("defaults.maxAttempts is passed to client config", () => {
    const config = {
      defaults: { maxAttempts: 5 },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].client.maxAttempts).toBe(5);
  });

  it("defaults.enableLogger adds AwsxConsoleLogger when no logger provided", () => {
    const config = {
      defaults: { enableLogger: true },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].client.logger).toBeDefined();
  });

  it("defaults.logger is used when enableLogger is true", () => {
    const customLogger = { info: () => {}, debug: () => {}, warn: () => {}, error: () => {} };
    const config = {
      defaults: { enableLogger: true, logger: customLogger },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].client.logger).toBe(customLogger);
  });

  it("service client options override defaults", () => {
    const config = {
      defaults: { maxAttempts: 3 },
      services: {
        [AwsxServiceKey.S3]: {
          client: { maxAttempts: 10 },
        },
      },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].client.maxAttempts).toBe(10);
  });

  it("preserves defaultBucket for S3", () => {
    const config = {
      services: {
        [AwsxServiceKey.S3]: { defaultBucket: "my-bucket" },
      },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].defaultBucket).toBe("my-bucket");
  });

  it("preserves endpoint for services", () => {
    const config = {
      services: {
        [AwsxServiceKey.S3]: { endpoint: "http://localhost:4566" },
      },
    };
    const result = normalizeConfig(config);
    expect(result.services[AwsxServiceKey.S3].endpoint).toBe("http://localhost:4566");
  });

  it("all four services get normalized", () => {
    const config = {
      defaults: { region: "us-east-1" },
    };
    const result = normalizeConfig(config);
    for (const key of [
      AwsxServiceKey.S3,
      AwsxServiceKey.Sqs,
      AwsxServiceKey.Ses,
      AwsxServiceKey.Route53,
    ]) {
      expect(result.services[key]).toHaveProperty("region");
      expect(result.services[key]).toHaveProperty("client");
      expect(result.services[key]).toHaveProperty("credentials");
    }
  });
});
