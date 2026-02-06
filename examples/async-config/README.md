# Async Config Example

Uses `AwsxModule.forRootAsync` with `ConfigService` to pull region/profile from env vars.

## Setup

```bash
export AWS_REGION=us-east-1
export AWS_PROFILE=default
npm install
npm run dev
```

## Files

- `src/app.module.ts`: Async AWSX configuration
- `src/app.service.ts`: SES service usage
- `src/app.controller.ts`: HTTP endpoints
- `src/main.ts`: NestJS bootstrap
