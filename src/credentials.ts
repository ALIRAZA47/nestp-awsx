import { defaultProvider } from "@aws-sdk/credential-provider-node";
import type { AwsCredentialIdentityProvider } from "@aws-sdk/types";
import { AwsxCredentialSource, type AwsxCredentialConfig } from "./types";

export const resolveCredentialProvider = (
  config: AwsxCredentialConfig,
): AwsCredentialIdentityProvider => {
  const source = config.source;

  if (source === AwsxCredentialSource.Static) {
    const accessKeyId = config.accessKeyId;
    const secretAccessKey = config.secretAccessKey;
    if (!accessKeyId || !secretAccessKey) {
      throw new Error("[awsx] Static credentials require accessKeyId and secretAccessKey.");
    }
    return async () => ({
      accessKeyId,
      secretAccessKey,
      sessionToken: config.sessionToken,
    });
  }

  if (source === AwsxCredentialSource.Profile) {
    if (!config.profile) {
      throw new Error("[awsx] Profile credentials require a profile name.");
    }
    return defaultProvider({ profile: config.profile });
  }

  if (source === AwsxCredentialSource.Default) {
    return defaultProvider();
  }

  if (config.accessKeyId && config.secretAccessKey) {
    const accessKeyId = config.accessKeyId;
    const secretAccessKey = config.secretAccessKey;
    return async () => ({
      accessKeyId,
      secretAccessKey,
      sessionToken: config.sessionToken,
    });
  }

  if (config.profile) {
    return defaultProvider({ profile: config.profile });
  }

  return defaultProvider();
};

export const resolveRegion = (
  serviceRegion: string | undefined,
  credentialConfig: AwsxCredentialConfig,
): string | undefined => {
  const envRegion = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION;
  return credentialConfig.region ?? serviceRegion ?? envRegion;
};
