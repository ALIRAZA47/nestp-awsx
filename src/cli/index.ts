import { Command } from "commander";
import prompts, { type PromptObject } from "prompts";
import pc from "picocolors";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import { AwsxCredentialSource, AwsxServiceKey } from "../types";

const DEFAULT_CONFIG_PATH = "awsx.config.json";
const PACKAGE_NAME = "@nestp/awsx";

type CredentialConfig = {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  profile?: string;
  source?: AwsxCredentialSource;
};

type ServiceConfig = {
  region?: string;
  credentials?: CredentialConfig;
};

type AwsxConfig = {
  defaults?: { region?: string };
  global?: CredentialConfig;
  services?: Partial<Record<AwsxServiceKey, ServiceConfig>>;
};

const prompt = <T>(questions: PromptObject | PromptObject[]): Promise<T> =>
  prompts(questions, {
    onCancel: () => {
      console.log(pc.yellow("Canceled."));
      process.exit(1);
    },
  }) as Promise<T>;

const logHeader = (text: string) => {
  console.log(pc.cyan(text));
};

const detectPackageManager = (): "npm" | "pnpm" | "yarn" | "bun" => {
  if (existsSync("pnpm-lock.yaml")) return "pnpm";
  if (existsSync("yarn.lock")) return "yarn";
  if (existsSync("bun.lockb")) return "bun";
  if (existsSync("package-lock.json")) return "npm";
  return "npm";
};

const runInstall = (pm: string) => {
  const argsMap: Record<string, string[]> = {
    npm: ["install", PACKAGE_NAME],
    pnpm: ["add", PACKAGE_NAME],
    yarn: ["add", PACKAGE_NAME],
    bun: ["add", PACKAGE_NAME],
  };
  const args = argsMap[pm] ?? argsMap.npm;
  const result = spawnSync(pm, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`Failed to install ${PACKAGE_NAME} using ${pm}.`);
  }
};

const cleanObject = <T extends Record<string, any>>(obj: T): T => {
  const cleaned: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return;
    }
    cleaned[key] = value;
  });
  return cleaned as T;
};

const promptCredential = async (label: string): Promise<CredentialConfig> => {
  const { type } = await prompt<{ type: AwsxCredentialSource }>({
    type: "select",
    name: "type",
    message: `${label}: credential source`,
    choices: [
      {
        title: "Default chain (env, shared config, metadata)",
        value: AwsxCredentialSource.Default,
      },
      { title: "Shared config profile", value: AwsxCredentialSource.Profile },
      { title: "Static access key", value: AwsxCredentialSource.Static },
    ],
  });

  const { region } = await prompt<{ region: string }>({
    type: "text",
    name: "region",
    message: `${label}: region override (optional)`,
    initial: "",
  });

  if (type === AwsxCredentialSource.Profile) {
    const { profile } = await prompt<{ profile: string }>({
      type: "text",
      name: "profile",
      message: `${label}: profile name`,
      initial: "default",
    });
    return cleanObject({ region, profile, source: type });
  }

  if (type === AwsxCredentialSource.Static) {
    const { accessKeyId } = await prompt<{ accessKeyId: string }>({
      type: "text",
      name: "accessKeyId",
      message: `${label}: access key id`,
      initial: "",
    });
    const { secretAccessKey } = await prompt<{ secretAccessKey: string }>({
      type: "password",
      name: "secretAccessKey",
      message: `${label}: secret access key`,
    });
    const { sessionToken } = await prompt<{ sessionToken: string }>({
      type: "password",
      name: "sessionToken",
      message: `${label}: session token (optional)`,
    });
    return cleanObject({ region, accessKeyId, secretAccessKey, sessionToken, source: type });
  }

  return cleanObject({ region, source: type });
};

const promptServiceConfig = async (
  serviceName: string,
  useGlobal: boolean,
): Promise<ServiceConfig | undefined> => {
  const { region } = await prompt<{ region: string }>({
    type: "text",
    name: "region",
    message: `${serviceName}: region override (optional)`,
    initial: "",
  });

  if (useGlobal) {
    return cleanObject({ region });
  }

  const cred = await promptCredential(serviceName);
  return cleanObject({ region, credentials: cred });
};

const writeConfig = async (filePath: string, config: AwsxConfig) => {
  const resolved = join(process.cwd(), filePath);
  const existing = existsSync(resolved);
  if (existing) {
    const { overwrite } = await prompt<{ overwrite: boolean }>({
      type: "confirm",
      name: "overwrite",
      message: `${filePath} already exists. Overwrite?`,
      initial: false,
    });
    if (!overwrite) {
      throw new Error("Canceled by user.");
    }
  }

  writeFileSync(resolved, JSON.stringify(config, null, 2));
};

const initFlow = async (withHeader = true) => {
  if (withHeader) {
    logHeader("awsx init");
  }

  const { configPath } = await prompt<{ configPath: string }>({
    type: "text",
    name: "configPath",
    message: "Config file path",
    initial: DEFAULT_CONFIG_PATH,
  });

  const { defaultRegion } = await prompt<{ defaultRegion: string }>({
    type: "text",
    name: "defaultRegion",
    message: "Default AWS region",
    initial: "us-east-1",
  });

  const { services } = await prompt<{ services: AwsxServiceKey[] }>({
    type: "multiselect",
    name: "services",
    message: "Select services to configure",
    choices: [
      { title: "S3", value: AwsxServiceKey.S3 },
      { title: "SQS", value: AwsxServiceKey.Sqs },
      { title: "SES", value: AwsxServiceKey.Ses },
      { title: "Route53", value: AwsxServiceKey.Route53 },
    ],
    min: 0,
  });

  const { useGlobalCreds } = await prompt<{ useGlobalCreds: boolean }>({
    type: "confirm",
    name: "useGlobalCreds",
    message: "Use one global credential set for all services?",
    initial: true,
  });

  let globalCredentials: CredentialConfig | undefined;
  if (useGlobalCreds) {
    globalCredentials = await promptCredential("Global credentials");
  }

  const selectedServices = services?.length
    ? services
    : [AwsxServiceKey.S3, AwsxServiceKey.Sqs, AwsxServiceKey.Ses, AwsxServiceKey.Route53];

  const serviceConfigs: Partial<Record<AwsxServiceKey, ServiceConfig>> = {};
  for (const service of selectedServices) {
    let serviceUseGlobal = false;
    if (useGlobalCreds) {
      const { useGlobal } = await prompt<{ useGlobal: boolean }>({
        type: "confirm",
        name: "useGlobal",
        message: `${service}: use global credentials?`,
        initial: true,
      });
      serviceUseGlobal = useGlobal;
    }

    const serviceConfig = await promptServiceConfig(service, serviceUseGlobal);
    if (serviceConfig) {
      serviceConfigs[service] = serviceConfig;
    }
  }

  const config: AwsxConfig = cleanObject({
    defaults: cleanObject({ region: defaultRegion }),
    global: globalCredentials,
    services: serviceConfigs,
  });

  await writeConfig(configPath, config);

  if (withHeader) {
    console.log(pc.green(`Config written to ${configPath}.`));
  }
};

const installFlow = async (withHeader = true) => {
  if (withHeader) {
    logHeader("awsx install");
  }
  const pmDetected = detectPackageManager();
  const { pm } = await prompt<{ pm: string }>({
    type: "select",
    name: "pm",
    message: "Select package manager",
    choices: [
      { title: `${pmDetected} (detected)`, value: pmDetected },
      { title: "npm", value: "npm" },
      { title: "pnpm", value: "pnpm" },
      { title: "yarn", value: "yarn" },
      { title: "bun", value: "bun" },
    ],
  });

  runInstall(pm);
  if (withHeader) {
    console.log(pc.green(`Installed ${PACKAGE_NAME}.`));
  }
};

const setupFlow = async () => {
  logHeader("awsx setup");
  const { shouldInstall } = await prompt<{ shouldInstall: boolean }>({
    type: "confirm",
    name: "shouldInstall",
    message: `Install ${PACKAGE_NAME} now?`,
    initial: true,
  });
  if (shouldInstall) {
    await installFlow(false);
  }
  await initFlow(false);
  console.log(pc.green("Setup complete."));
};

const program = new Command();

program
  .name("awsx")
  .description("AWSX CLI for NestJS AWS integrations")
  .version("0.1.0");

program
  .command("init")
  .description("Create an awsx.config.json file")
  .action(() => {
    initFlow().catch((error) => {
      console.error(pc.red(error.message));
      process.exit(1);
    });
  });

program
  .command("install")
  .description(`Install ${PACKAGE_NAME} with your package manager`)
  .action(() => {
    installFlow().catch((error) => {
      console.error(pc.red(error.message));
      process.exit(1);
    });
  });

program
  .command("setup")
  .description(`Install ${PACKAGE_NAME} and generate config`)
  .action(() => {
    setupFlow().catch((error) => {
      console.error(pc.red(error.message));
      process.exit(1);
    });
  });

program.parse();
