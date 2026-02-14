import example01 from "../../../examples/use-cases/01-module-for-root.ts?raw";
import example02 from "../../../examples/use-cases/02-module-for-root-async-factory.ts?raw";
import example03 from "../../../examples/use-cases/03-module-for-root-async-class.ts?raw";
import example04 from "../../../examples/use-cases/04-credentials-default.ts?raw";
import example05 from "../../../examples/use-cases/05-credentials-profile.ts?raw";
import example06 from "../../../examples/use-cases/06-credentials-static.ts?raw";
import example07 from "../../../examples/use-cases/07-client-logger.ts?raw";
import example08 from "../../../examples/use-cases/08-s3-default-bucket.ts?raw";
import example09 from "../../../examples/use-cases/09-s3-core.ts?raw";
import example10 from "../../../examples/use-cases/10-s3-helpers.ts?raw";
import example11 from "../../../examples/use-cases/11-s3-signed-url.ts?raw";
import example12 from "../../../examples/use-cases/12-s3-bulk-failsafe.ts?raw";
import example13 from "../../../examples/use-cases/13-s3-upload-progress.ts?raw";
import example14 from "../../../examples/use-cases/14-sqs-core.ts?raw";
import example15 from "../../../examples/use-cases/15-sqs-helpers.ts?raw";
import example16 from "../../../examples/use-cases/16-ses-core.ts?raw";
import example17 from "../../../examples/use-cases/17-ses-helpers.ts?raw";
import example18 from "../../../examples/use-cases/18-route53-core.ts?raw";
import example19 from "../../../examples/use-cases/19-route53-helpers.ts?raw";
import example20 from "../../../examples/use-cases/20-inject-raw-clients.ts?raw";
import example21 from "../../../examples/use-cases/21-inject-services.ts?raw";
import example22 from "../../../examples/use-cases/22-override-service.ts?raw";
import example23 from "../../../examples/use-cases/23-awsx-service-facade.ts?raw";
import example24 from "../../../examples/use-cases/24-cli-workflow.md?raw";
import basicModule from "../../../examples/basic/src/app.module.ts?raw";
import basicService from "../../../examples/basic/src/app.service.ts?raw";
import asyncModule from "../../../examples/async-config/src/app.module.ts?raw";

export type ExampleId =
  | "module.forRoot"
  | "module.forRootAsync.factory"
  | "module.forRootAsync.class"
  | "credentials.default"
  | "credentials.profile"
  | "credentials.static"
  | "clients.logger"
  | "s3.defaultBucket"
  | "s3.core"
  | "s3.helpers"
  | "s3.signedUrl"
  | "s3.putMany"
  | "s3.progress"
  | "sqs.core"
  | "sqs.helpers"
  | "ses.core"
  | "ses.helpers"
  | "route53.core"
  | "route53.helpers"
  | "inject.rawClients"
  | "inject.services"
  | "override.service"
  | "facade.awsxService"
  | "cli.workflow"
  | "app.basic.module"
  | "app.basic.service"
  | "app.async.module";

type ExampleSnippet = {
  title: string;
  filePath: string;
  code: string;
};

export const exampleSnippets: Record<ExampleId, ExampleSnippet> = {
  "module.forRoot": {
    title: "AwsxModule.forRoot",
    filePath: "examples/use-cases/01-module-for-root.ts",
    code: example01,
  },
  "module.forRootAsync.factory": {
    title: "AwsxModule.forRootAsync (useFactory)",
    filePath: "examples/use-cases/02-module-for-root-async-factory.ts",
    code: example02,
  },
  "module.forRootAsync.class": {
    title: "AwsxModule.forRootAsync (useClass)",
    filePath: "examples/use-cases/03-module-for-root-async-class.ts",
    code: example03,
  },
  "credentials.default": {
    title: "Default credential chain",
    filePath: "examples/use-cases/04-credentials-default.ts",
    code: example04,
  },
  "credentials.profile": {
    title: "Shared profile credentials",
    filePath: "examples/use-cases/05-credentials-profile.ts",
    code: example05,
  },
  "credentials.static": {
    title: "Static credentials",
    filePath: "examples/use-cases/06-credentials-static.ts",
    code: example06,
  },
  "clients.logger": {
    title: "Global client logger",
    filePath: "examples/use-cases/07-client-logger.ts",
    code: example07,
  },
  "s3.defaultBucket": {
    title: "S3 default bucket",
    filePath: "examples/use-cases/08-s3-default-bucket.ts",
    code: example08,
  },
  "s3.core": {
    title: "S3 core methods",
    filePath: "examples/use-cases/09-s3-core.ts",
    code: example09,
  },
  "s3.helpers": {
    title: "S3 helper methods",
    filePath: "examples/use-cases/10-s3-helpers.ts",
    code: example10,
  },
  "s3.signedUrl": {
    title: "S3 signed URLs",
    filePath: "examples/use-cases/11-s3-signed-url.ts",
    code: example11,
  },
  "s3.putMany": {
    title: "S3 putMany (failsafe)",
    filePath: "examples/use-cases/12-s3-bulk-failsafe.ts",
    code: example12,
  },
  "s3.progress": {
    title: "S3 upload progress helper",
    filePath: "examples/use-cases/13-s3-upload-progress.ts",
    code: example13,
  },
  "sqs.core": {
    title: "SQS core methods",
    filePath: "examples/use-cases/14-sqs-core.ts",
    code: example14,
  },
  "sqs.helpers": {
    title: "SQS helper methods",
    filePath: "examples/use-cases/15-sqs-helpers.ts",
    code: example15,
  },
  "ses.core": {
    title: "SES core method",
    filePath: "examples/use-cases/16-ses-core.ts",
    code: example16,
  },
  "ses.helpers": {
    title: "SES helper methods",
    filePath: "examples/use-cases/17-ses-helpers.ts",
    code: example17,
  },
  "route53.core": {
    title: "Route53 core methods",
    filePath: "examples/use-cases/18-route53-core.ts",
    code: example18,
  },
  "route53.helpers": {
    title: "Route53 helper methods",
    filePath: "examples/use-cases/19-route53-helpers.ts",
    code: example19,
  },
  "inject.rawClients": {
    title: "Inject raw clients",
    filePath: "examples/use-cases/20-inject-raw-clients.ts",
    code: example20,
  },
  "inject.services": {
    title: "Inject service wrappers",
    filePath: "examples/use-cases/21-inject-services.ts",
    code: example21,
  },
  "override.service": {
    title: "Override built-in service",
    filePath: "examples/use-cases/22-override-service.ts",
    code: example22,
  },
  "facade.awsxService": {
    title: "Use AwsxService facade",
    filePath: "examples/use-cases/23-awsx-service-facade.ts",
    code: example23,
  },
  "cli.workflow": {
    title: "CLI workflow",
    filePath: "examples/use-cases/24-cli-workflow.md",
    code: example24,
  },
  "app.basic.module": {
    title: "Runnable example: basic app module",
    filePath: "examples/basic/src/app.module.ts",
    code: basicModule,
  },
  "app.basic.service": {
    title: "Runnable example: basic app service",
    filePath: "examples/basic/src/app.service.ts",
    code: basicService,
  },
  "app.async.module": {
    title: "Runnable example: async-config app module",
    filePath: "examples/async-config/src/app.module.ts",
    code: asyncModule,
  },
};
