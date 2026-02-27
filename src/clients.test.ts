import { describe, it, expect, vi } from "vitest";
import { createClient } from "./clients";
import type { AwsxServiceConfigNormalized } from "./types";

describe("createClient", () => {
  it("instantiates client with resolved config", () => {
    const MockClient = vi.fn();
    const serviceConfig: AwsxServiceConfigNormalized = {
      region: "us-east-1",
      credentials: {
        accessKeyId: "AKIA",
        secretAccessKey: "secret",
      },
      client: {},
    };
    const result = createClient(serviceConfig, MockClient as any);
    expect(MockClient).toHaveBeenCalledTimes(1);
    const callConfig = MockClient.mock.calls[0][0];
    expect(callConfig.region).toBe("us-east-1");
    expect(typeof callConfig.credentials).toBe("function");
    expect(result).toBeDefined();
  });

  it("merges service client options into config", () => {
    const MockClient = vi.fn();
    const serviceConfig: AwsxServiceConfigNormalized = {
      region: "eu-west-1",
      credentials: {},
      client: { maxAttempts: 5, customOption: true },
    };
    createClient(serviceConfig, MockClient as any);
    const callConfig = MockClient.mock.calls[0][0];
    expect(callConfig.maxAttempts).toBe(5);
    expect(callConfig.customOption).toBe(true);
  });

  it("passes endpoint when configured", () => {
    const MockClient = vi.fn();
    const serviceConfig: AwsxServiceConfigNormalized = {
      region: "us-east-1",
      endpoint: "http://localhost:4566",
      credentials: {},
      client: {},
    };
    createClient(serviceConfig, MockClient as any);
    const callConfig = MockClient.mock.calls[0][0];
    expect(callConfig.endpoint).toBe("http://localhost:4566");
  });
});
