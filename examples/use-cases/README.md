# AWSX Use-Case Examples

This folder contains focused, copy-ready examples for every major API/use case in `@nestp/awsx`.

## Index

- `01-module-for-root.ts`: `AwsxModule.forRoot`
- `02-module-for-root-async-factory.ts`: `AwsxModule.forRootAsync` with `useFactory`
- `03-module-for-root-async-class.ts`: `AwsxModule.forRootAsync` with `useClass`
- `04-credentials-default.ts`: default credential chain
- `05-credentials-profile.ts`: shared profile credentials
- `06-credentials-static.ts`: static key credentials
- `07-client-logger.ts`: global AWS client logger
- `08-s3-default-bucket.ts`: default S3 bucket usage
- `09-s3-core.ts`: core S3 methods
- `10-s3-helpers.ts`: S3 helper methods
- `11-s3-signed-url.ts`: signed URLs
- `12-s3-bulk-failsafe.ts`: bulk uploads with partial-failure handling
- `13-s3-upload-progress.ts`: upload progress helper
- `14-sqs-core.ts`: core SQS methods
- `15-sqs-helpers.ts`: SQS helper methods
- `16-ses-core.ts`: core SES method
- `17-ses-helpers.ts`: SES helper methods
- `18-route53-core.ts`: core Route53 methods
- `19-route53-helpers.ts`: Route53 helper methods
- `20-inject-raw-clients.ts`: inject raw AWS SDK clients
- `21-inject-services.ts`: inject AWSX services
- `22-override-service.ts`: override built-in service implementation
- `23-awsx-service-facade.ts`: consume `AwsxService` facade
- `24-cli-workflow.md`: CLI usage reference
