import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DependencyInjectionPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Configuration"
        title="Dependency Injection & Overrides"
        description="AWSX exports explicit DI tokens so you can inject clients/services directly and override implementations where needed."
      />

      <Card>
        <CardHeader>
          <CardTitle>Injection strategy</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>Inject raw clients when you need complete AWS SDK surface area or custom commands.</li>
            <li>Inject wrappers when you want AWSX helper methods and normalized default behavior.</li>
            <li>Override services via `AwsxToken.*Service` provider bindings inside your own module.</li>
            <li>`AwsxService` facade is useful when one class needs multiple AWS services.</li>
            <li>For tests, use `AwsxModule.forTesting(config?, mocks?)` to get a module with mock clients and no real AWS calls.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exported DI tokens</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>`AwsxToken.S3Client`, `AwsxToken.SqsClient`, `AwsxToken.SesClient`, `AwsxToken.Route53Client`, `AwsxToken.EventBridgeClient`</li>
            <li>`AwsxToken.S3Service`, `AwsxToken.SqsService`, `AwsxToken.SesService`, `AwsxToken.Route53Service`, `AwsxToken.EventBridgeService`</li>
            <li>`AwsxToken.Config` for normalized runtime config object access</li>
            <li>`AwsxSqsConsumerService` for long-poll SQS consumers (inject and call `startConsumer(handler, options?)` in `onModuleInit`)</li>
            <li>`AwsxHealthIndicator` for health checks with Terminus (add as provider; use `checkS3`, `checkSqs`, `checkSes`, `checkEventBridge` in your health controller)</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference id="inject.rawClients" />
      <ExampleReference id="inject.services" />
      <ExampleReference id="override.service" />
    </div>
  );
}
