import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IntroductionPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Introduction"
        title="NestP AWSX"
        description="NestP AWSX is a NestJS-first integration layer for AWS SDK v3. It centralizes client setup, credentials, logger wiring, and common service helper methods for S3, SQS, SES, and Route53."
      />

      <Card>
        <CardHeader>
          <CardTitle>What the package gives you</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p>Single place to configure AWS region, credentials, retries, and client logging.</p>
          <p>One AWS SDK client instance per service (`S3`, `SQS`, `SES`, `Route53`).</p>
          <p>Typed enums for service keys, credential sources, signed URL operations, and injection tokens.</p>
          <p>Service wrappers with helper methods for common tasks plus direct raw client access when needed.</p>
          <p>Interactive CLI (`awsx install`, `awsx init`, `awsx setup`) to bootstrap usage quickly.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Architecture in practice</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>`AwsxModule` owns configuration normalization and provider wiring.</li>
            <li>`AwsxService` is a facade that exposes `s3`, `sqs`, `ses`, and `route53` services.</li>
            <li>`AwsxToken` exports DI-safe tokens so you can inject or override any service/client.</li>
            <li>Per-service config can override region/credentials while still inheriting global defaults.</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference
        id="module.forRoot"
        description="Canonical module setup with defaults and service registration."
      />
    </div>
  );
}
