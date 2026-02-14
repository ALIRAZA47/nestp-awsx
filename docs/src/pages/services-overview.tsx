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
            <li>`S3Service`: JSON helpers, signed URLs, failsafe bulk upload, upload progress tracking.</li>
            <li>`SqsService`: JSON message helpers and batch send/delete helpers.</li>
            <li>`SesService`: text and HTML send shortcuts.</li>
            <li>`Route53Service`: A and TXT upsert helpers.</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference id="facade.awsxService" description="Single facade-based service usage." />
      <ExampleReference id="inject.services" description="Inject service wrappers directly." />
      <ExampleReference id="inject.rawClients" description="Inject raw AWS SDK clients by token." />
    </div>
  );
}
