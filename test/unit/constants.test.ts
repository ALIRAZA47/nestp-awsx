import { describe, it, expect } from "vitest";
import { AwsxToken } from "../../src/constants";

describe("AwsxToken", () => {
  it("has Config token", () => {
    expect(AwsxToken.Config).toBe("AWSX_CONFIG");
  });

  it("has all client tokens", () => {
    expect(AwsxToken.S3Client).toBe("AWSX_S3_CLIENT");
    expect(AwsxToken.SqsClient).toBe("AWSX_SQS_CLIENT");
    expect(AwsxToken.SesClient).toBe("AWSX_SES_CLIENT");
    expect(AwsxToken.Route53Client).toBe("AWSX_ROUTE53_CLIENT");
  });

  it("has all service tokens", () => {
    expect(AwsxToken.S3Service).toBe("AWSX_S3_SERVICE");
    expect(AwsxToken.SqsService).toBe("AWSX_SQS_SERVICE");
    expect(AwsxToken.SesService).toBe("AWSX_SES_SERVICE");
    expect(AwsxToken.Route53Service).toBe("AWSX_ROUTE53_SERVICE");
  });
});
