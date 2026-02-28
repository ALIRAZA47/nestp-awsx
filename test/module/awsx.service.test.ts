import { describe, it, expect } from "vitest";
import { Test } from "@nestjs/testing";
import { AwsxModule } from "../../src/awsx.module";
import { AwsxService } from "../../src/awsx.service";
import { AwsxServiceKey } from "../../src/types";

describe("AwsxService", () => {
  const config = {
    services: {
      [AwsxServiceKey.S3]: {
        credentials: { accessKeyId: "AKIA", secretAccessKey: "secret" },
      },
      [AwsxServiceKey.Sqs]: {
        credentials: { accessKeyId: "AKIA", secretAccessKey: "secret" },
      },
      [AwsxServiceKey.Ses]: {
        credentials: { accessKeyId: "AKIA", secretAccessKey: "secret" },
      },
      [AwsxServiceKey.Route53]: {
        credentials: { accessKeyId: "AKIA", secretAccessKey: "secret" },
      },
    },
  };

  it("injects s3, sqs, ses, route53 services", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AwsxModule.forRoot(config)],
    }).compile();
    const awsx = moduleRef.get(AwsxService);
    expect(awsx.s3).toBeDefined();
    expect(awsx.sqs).toBeDefined();
    expect(awsx.ses).toBeDefined();
    expect(awsx.route53).toBeDefined();
  });

  it("all services have expected methods", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AwsxModule.forRoot(config)],
    }).compile();
    const awsx = moduleRef.get(AwsxService);
    expect(typeof awsx.s3.putObject).toBe("function");
    expect(typeof awsx.sqs.sendMessage).toBe("function");
    expect(typeof awsx.ses.sendEmail).toBe("function");
    expect(typeof awsx.route53.listHostedZones).toBe("function");
  });
});
