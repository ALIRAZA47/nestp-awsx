import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ServicesOverviewPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Services"
        title="Services Overview"
        description="You can consume AWSX through the `AwsxService` facade, through individual service wrappers, or by injecting raw AWS SDK clients using `AwsxToken`."
      />

      <Card>
        <CardHeader>
          <CardTitle>Ways to consume AWSX</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p><span className="font-semibold text-foreground">Facade:</span> inject `AwsxService` for a single entrypoint to all wrapped services.</p>
          <p><span className="font-semibold text-foreground">Service wrappers:</span> inject `S3Service`, `SqsService`, `SesService`, or `Route53Service` directly.</p>
          <p><span className="font-semibold text-foreground">Raw clients:</span> inject `AwsxToken.S3Client` and related tokens for direct SDK access.</p>
          <p>Each service always has one client instance configured through normalized global/service config.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service helper surface</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>`S3Service`: JSON helpers, stream download, copy/move, signed URLs, failsafe bulk upload, upload progress tracking.</li>
            <li>`SqsService`: default queue URL, JSON helpers, batch send/delete, `processBatch`, and `AwsxSqsConsumerService` for long-poll consumers.</li>
            <li>`SesService`: text, HTML, and templated-email send shortcuts.</li>
            <li>`Route53Service`: A, CNAME, AAAA, and TXT upsert helpers.</li>
            <li>`AwsxHealthIndicator`: optional health checks for S3/SQS/SES (e.g. with Terminus).</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference id="facade.awsxService" description="Single facade-based service usage." />
      <ExampleReference id="inject.services" description="Inject service wrappers directly." />
      <ExampleReference id="inject.rawClients" description="Inject raw AWS SDK clients by token." />
    </div>
  );
}
