import { describe, it, expect } from "vitest";
import { Test } from "@nestjs/testing";
import { AwsxModule } from "../../src/awsx.module";
import { AwsxToken } from "../../src/constants";
import { AwsxService } from "../../src/awsx.service";
import { AwsxServiceKey } from "../../src/types";

describe("AwsxModule", () => {
  const minimalConfig = {
    services: {
      [AwsxServiceKey.S3]: {
        credentials: {
          accessKeyId: "AKIA",
          secretAccessKey: "secret",
        },
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

  describe("forRoot", () => {
    it("returns DynamicModule with providers", () => {
      const mod = AwsxModule.forRoot(minimalConfig);
      expect(mod.module).toBe(AwsxModule);
      expect(mod.providers).toBeDefined();
      expect(Array.isArray(mod.providers)).toBe(true);
    });

    it("provides AwsxToken.Config", () => {
      const mod = AwsxModule.forRoot(minimalConfig);
      const configProvider = mod.providers?.find(
        (p: any) => p.provide === AwsxToken.Config,
      );
      expect(configProvider).toBeDefined();
      expect(configProvider?.useValue).toBeDefined();
    });

    it("exports AwsxService and all service tokens", () => {
      const mod = AwsxModule.forRoot(minimalConfig);
      expect(mod.exports).toContain(AwsxToken.S3Service);
      expect(mod.exports).toContain(AwsxToken.SqsService);
      expect(mod.exports).toContain(AwsxToken.SesService);
      expect(mod.exports).toContain(AwsxToken.Route53Service);
      expect(mod.exports).toContain(AwsxService);
    });

    it("creates a working module", async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AwsxModule.forRoot(minimalConfig)],
      }).compile();
      const awsx = moduleRef.get(AwsxService);
      expect(awsx).toBeDefined();
      expect(awsx.s3).toBeDefined();
      expect(awsx.sqs).toBeDefined();
      expect(awsx.ses).toBeDefined();
      expect(awsx.route53).toBeDefined();
    });
  });

  describe("forRootAsync", () => {
    it("works with useFactory", async () => {
      const mod = AwsxModule.forRootAsync({
        useFactory: () => minimalConfig,
      });
      const moduleRef = await Test.createTestingModule({
        imports: [mod],
      }).compile();
      const awsx = moduleRef.get(AwsxService);
      expect(awsx).toBeDefined();
    });

    it("works with async useFactory", async () => {
      const mod = AwsxModule.forRootAsync({
        useFactory: async () => minimalConfig,
      });
      const moduleRef = await Test.createTestingModule({
        imports: [mod],
      }).compile();
      const awsx = moduleRef.get(AwsxService);
      expect(awsx).toBeDefined();
    });

    it("works with useClass", async () => {
      class ConfigFactory {
        createAwsxConfig() {
          return minimalConfig;
        }
      }
      const mod = AwsxModule.forRootAsync({
        useClass: ConfigFactory,
      });
      const moduleRef = await Test.createTestingModule({
        imports: [mod],
      }).compile();
      const awsx = moduleRef.get(AwsxService);
      expect(awsx).toBeDefined();
    });

    it("works with async useClass createAwsxConfig", async () => {
      class ConfigFactory {
        async createAwsxConfig() {
          return minimalConfig;
        }
      }
      const mod = AwsxModule.forRootAsync({
        useClass: ConfigFactory,
      });
      const moduleRef = await Test.createTestingModule({
        imports: [mod],
      }).compile();
      const awsx = moduleRef.get(AwsxService);
      expect(awsx).toBeDefined();
    });

    it("throws when neither useFactory nor useClass provided", () => {
      expect(() =>
        AwsxModule.forRootAsync({} as any),
      ).toThrow("[awsx] Invalid async configuration. Provide useFactory or useClass.");
    });

    it("includes optional imports", () => {
      const ConfigModule = {};
      const mod = AwsxModule.forRootAsync({
        imports: [ConfigModule as any],
        useFactory: () => minimalConfig,
      });
      expect(mod.imports).toContain(ConfigModule);
    });
  });
});
