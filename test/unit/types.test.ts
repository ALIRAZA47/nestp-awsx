import { describe, it, expect } from "vitest";
import {
  AwsxServiceKey,
  AwsxCredentialSource,
  AwsxS3SignedUrlOperation,
  AwsxRoute53ChangeAction,
  AwsxRoute53RecordType,
} from "../../src/types";

describe("AwsxServiceKey", () => {
  it("has expected service keys", () => {
    expect(AwsxServiceKey.S3).toBe("s3");
    expect(AwsxServiceKey.Sqs).toBe("sqs");
    expect(AwsxServiceKey.Ses).toBe("ses");
    expect(AwsxServiceKey.Route53).toBe("route53");
  });
});

describe("AwsxCredentialSource", () => {
  it("has expected credential sources", () => {
    expect(AwsxCredentialSource.Default).toBe("default");
    expect(AwsxCredentialSource.Profile).toBe("profile");
    expect(AwsxCredentialSource.Static).toBe("static");
  });
});

describe("AwsxS3SignedUrlOperation", () => {
  it("has getObject and putObject", () => {
    expect(AwsxS3SignedUrlOperation.GetObject).toBe("getObject");
    expect(AwsxS3SignedUrlOperation.PutObject).toBe("putObject");
  });
});

describe("AwsxRoute53ChangeAction", () => {
  it("has expected change actions", () => {
    expect(AwsxRoute53ChangeAction.Create).toBe("CREATE");
    expect(AwsxRoute53ChangeAction.Delete).toBe("DELETE");
    expect(AwsxRoute53ChangeAction.Upsert).toBe("UPSERT");
  });
});

describe("AwsxRoute53RecordType", () => {
  it("has A and TXT types", () => {
    expect(AwsxRoute53RecordType.A).toBe("A");
    expect(AwsxRoute53RecordType.Txt).toBe("TXT");
  });
});
