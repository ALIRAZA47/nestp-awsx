import { describe, it, expect } from "vitest";
import * as awsx from "./index";

describe("index exports", () => {
  it("exports AwsxModule", () => {
    expect(awsx.AwsxModule).toBeDefined();
  });

  it("exports AwsxService", () => {
    expect(awsx.AwsxService).toBeDefined();
  });

  it("exports AwsxToken", () => {
    expect(awsx.AwsxToken).toBeDefined();
    expect(awsx.AwsxToken.S3Service).toBe("AWSX_S3_SERVICE");
  });

  it("exports enums", () => {
    expect(awsx.AwsxCredentialSource).toBeDefined();
    expect(awsx.AwsxRoute53ChangeAction).toBeDefined();
    expect(awsx.AwsxRoute53RecordType).toBeDefined();
    expect(awsx.AwsxServiceKey).toBeDefined();
    expect(awsx.AwsxS3SignedUrlOperation).toBeDefined();
  });

  it("exports AwsxConsoleLogger", () => {
    expect(awsx.AwsxConsoleLogger).toBeDefined();
  });

  it("exports service classes", () => {
    expect(awsx.S3Service).toBeDefined();
    expect(awsx.SqsService).toBeDefined();
    expect(awsx.SesService).toBeDefined();
    expect(awsx.Route53Service).toBeDefined();
  });
});
