import { describe, it, expect, afterEach } from "vitest";
import {
  resolveCredentialProvider,
  resolveRegion,
} from "../../src/credentials";
import { AwsxCredentialSource } from "../../src/types";

describe("resolveCredentialProvider", () => {
  describe("AwsxCredentialSource.Static", () => {
    it("returns provider when accessKeyId and secretAccessKey are provided", async () => {
      const config = {
        source: AwsxCredentialSource.Static,
        accessKeyId: "AKIA123",
        secretAccessKey: "secret123",
      };
      const provider = resolveCredentialProvider(config);
      const creds = await provider();
      expect(creds).toEqual({
        accessKeyId: "AKIA123",
        secretAccessKey: "secret123",
        sessionToken: undefined,
      });
    });

    it("includes sessionToken when provided", async () => {
      const config = {
        source: AwsxCredentialSource.Static,
        accessKeyId: "AKIA123",
        secretAccessKey: "secret123",
        sessionToken: "token123",
      };
      const provider = resolveCredentialProvider(config);
      const creds = await provider();
      expect(creds.sessionToken).toBe("token123");
    });

    it("throws when accessKeyId is missing", () => {
      const config = {
        source: AwsxCredentialSource.Static,
        secretAccessKey: "secret123",
      };
      expect(() => resolveCredentialProvider(config)).toThrow(
        "[awsx] Static credentials require accessKeyId and secretAccessKey.",
      );
    });

    it("throws when secretAccessKey is missing", () => {
      const config = {
        source: AwsxCredentialSource.Static,
        accessKeyId: "AKIA123",
      };
      expect(() => resolveCredentialProvider(config)).toThrow(
        "[awsx] Static credentials require accessKeyId and secretAccessKey.",
      );
    });
  });

  describe("AwsxCredentialSource.Profile", () => {
    it("throws when profile is missing", () => {
      const config = {
        source: AwsxCredentialSource.Profile,
      };
      expect(() => resolveCredentialProvider(config)).toThrow(
        "[awsx] Profile credentials require a profile name.",
      );
    });

    it("returns defaultProvider when profile is provided", () => {
      const config = {
        source: AwsxCredentialSource.Profile,
        profile: "my-profile",
      };
      const provider = resolveCredentialProvider(config);
      expect(typeof provider).toBe("function");
    });
  });

  describe("AwsxCredentialSource.Default", () => {
    it("returns defaultProvider", () => {
      const config = { source: AwsxCredentialSource.Default };
      const provider = resolveCredentialProvider(config);
      expect(typeof provider).toBe("function");
    });
  });

  describe("implicit credentials (accessKeyId + secretAccessKey without source)", () => {
    it("returns static provider when both keys present", async () => {
      const config = {
        accessKeyId: "AKIA456",
        secretAccessKey: "secret456",
      };
      const provider = resolveCredentialProvider(config);
      const creds = await provider();
      expect(creds).toEqual({
        accessKeyId: "AKIA456",
        secretAccessKey: "secret456",
        sessionToken: undefined,
      });
    });
  });

  describe("implicit profile", () => {
    it("returns defaultProvider when profile is set", () => {
      const config = { profile: "dev" };
      const provider = resolveCredentialProvider(config);
      expect(typeof provider).toBe("function");
    });
  });

  describe("fallback to default", () => {
    it("returns defaultProvider when no credentials configured", () => {
      const config = {};
      const provider = resolveCredentialProvider(config);
      expect(typeof provider).toBe("function");
    });
  });
});

describe("resolveRegion", () => {
  const originalRegion = process.env.AWS_REGION;
  const originalDefaultRegion = process.env.AWS_DEFAULT_REGION;

  afterEach(() => {
    if (originalRegion !== undefined) {
      process.env.AWS_REGION = originalRegion;
    } else {
      delete process.env.AWS_REGION;
    }
    if (originalDefaultRegion !== undefined) {
      process.env.AWS_DEFAULT_REGION = originalDefaultRegion;
    } else {
      delete process.env.AWS_DEFAULT_REGION;
    }
  });

  it("returns credentialConfig.region when set", () => {
    const result = resolveRegion("us-west-1", { region: "eu-west-1" });
    expect(result).toBe("eu-west-1");
  });

  it("returns serviceRegion when credentialConfig.region is not set", () => {
    const result = resolveRegion("us-east-1", {});
    expect(result).toBe("us-east-1");
  });

  it("returns AWS_REGION from env when others not set", () => {
    process.env.AWS_REGION = "ap-northeast-1";
    delete process.env.AWS_DEFAULT_REGION;
    const result = resolveRegion(undefined, {});
    expect(result).toBe("ap-northeast-1");
  });

  it("returns AWS_DEFAULT_REGION when AWS_REGION not set", () => {
    delete process.env.AWS_REGION;
    process.env.AWS_DEFAULT_REGION = "sa-east-1";
    const result = resolveRegion(undefined, {});
    expect(result).toBe("sa-east-1");
  });

  it("credentialConfig.region overrides env", () => {
    process.env.AWS_REGION = "us-east-1";
    const result = resolveRegion("us-west-1", { region: "eu-central-1" });
    expect(result).toBe("eu-central-1");
  });

  it("returns undefined when nothing is set", () => {
    delete process.env.AWS_REGION;
    delete process.env.AWS_DEFAULT_REGION;
    const result = resolveRegion(undefined, {});
    expect(result).toBeUndefined();
  });
});
