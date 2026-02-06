import {
  AwsxConfig,
  AwsxCredentialConfig,
  AwsxDefaults,
  AwsxNormalizedConfig,
  AwsxServiceConfig,
  AwsxServiceConfigNormalized,
  AwsxServiceKey,
} from "./types";

const mergeCredentialConfigs = (
  base: AwsxCredentialConfig | undefined,
  override: AwsxCredentialConfig | undefined,
): AwsxCredentialConfig => ({
  ...(base ?? {}),
  ...(override ?? {}),
});

const resolveCredentials = (
  serviceCredentials: AwsxCredentialConfig | undefined,
  globalCredentials: AwsxCredentialConfig | undefined,
): AwsxCredentialConfig => mergeCredentialConfigs(globalCredentials, serviceCredentials);

const normalizeServiceConfig = (
  service: AwsxServiceConfig | undefined,
  globalCredentials: AwsxCredentialConfig | undefined,
  defaults: AwsxDefaults,
): AwsxServiceConfigNormalized => {
  const normalizedService: AwsxServiceConfig = service ?? {};
  const clientDefaults: Record<string, unknown> = {};
  if (defaults.maxAttempts) {
    clientDefaults.maxAttempts = defaults.maxAttempts;
  }

  return {
    region: normalizedService.region ?? globalCredentials?.region ?? defaults.region,
    endpoint: normalizedService.endpoint,
    client: { ...clientDefaults, ...(normalizedService.client ?? {}) },
    credentials: resolveCredentials(normalizedService.credentials, globalCredentials),
  };
};

export const normalizeConfig = (config: AwsxConfig): AwsxNormalizedConfig => {
  const defaults: AwsxDefaults = config.defaults ?? {};
  const globalCredentials: AwsxCredentialConfig = config.global ?? {};
  const services = config.services ?? {};

  return {
    defaults,
    global: globalCredentials,
    services: {
      [AwsxServiceKey.S3]: normalizeServiceConfig(
        services[AwsxServiceKey.S3],
        globalCredentials,
        defaults,
      ),
      [AwsxServiceKey.Sqs]: normalizeServiceConfig(
        services[AwsxServiceKey.Sqs],
        globalCredentials,
        defaults,
      ),
      [AwsxServiceKey.Ses]: normalizeServiceConfig(
        services[AwsxServiceKey.Ses],
        globalCredentials,
        defaults,
      ),
      [AwsxServiceKey.Route53]: normalizeServiceConfig(
        services[AwsxServiceKey.Route53],
        globalCredentials,
        defaults,
      ),
    },
  };
};
