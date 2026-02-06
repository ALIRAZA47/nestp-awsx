# Basic Example

A runnable NestJS app using AWSX with the default credential chain.

## Setup

```bash
npm install
npm run dev
```

## Files

- `src/app.module.ts`: AWSX configuration
- `src/app.service.ts`: Uses S3/SQS services
- `src/app.controller.ts`: HTTP endpoints
- `src/main.ts`: NestJS bootstrap
