import type { AwsxServiceConfigNormalized } from "./types";
import { resolveCredentialProvider, resolveRegion } from "./credentials";

const createClientConfig = (
  serviceConfig: AwsxServiceConfigNormalized,
): Record<string, unknown> => {
  const region = resolveRegion(serviceConfig.region, serviceConfig.credentials);

  return {
    ...serviceConfig.client,
    region,
    endpoint: serviceConfig.endpoint,
    credentials: resolveCredentialProvider(serviceConfig.credentials),
  };
};

export const createClient = <TClient>(
  serviceConfig: AwsxServiceConfigNormalized,
  ClientCtor: new (config: any) => TClient,
): TClient => {
  const config = createClientConfig(serviceConfig);
  return new ClientCtor(config);
};
