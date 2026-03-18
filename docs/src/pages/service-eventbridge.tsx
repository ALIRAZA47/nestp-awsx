import { DocHeader } from "@/components/doc-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";

export function EventBridgePage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Services"
        title="EventBridge Service"
        description="`EventBridgeService` wraps Amazon EventBridge: put events to the default or custom event bus, and manage rules and targets."
      />

      <Card>
        <CardHeader>
          <CardTitle>Methods</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p><span className="font-semibold text-foreground">putEvents</span> — Send a batch of events (raw <code>PutEventsCommand</code> input).</p>
          <p><span className="font-semibold text-foreground">putEvent</span> — Send a single event; <code>Detail</code> can be an object (JSON-stringified) or a string.</p>
          <p><span className="font-semibold text-foreground">putRule</span> — Create or update a rule (e.g. schedule or event pattern).</p>
          <p><span className="font-semibold text-foreground">putTargets</span> — Attach targets to a rule (e.g. SQS queue, Lambda).</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example: putEvent</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={`await this.awsx.eventBridge.putEvent({
  Source: "my.app",
  DetailType: "OrderCreated",
  Detail: { orderId: "123", total: 99.99 },
});`}
            language="typescript"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example: putEvents (batch)</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={`await this.awsx.eventBridge.putEvents({
  Entries: [
    { Source: "my.app", DetailType: "UserSignedUp", Detail: JSON.stringify({ userId: "u-1" }) },
    { Source: "my.app", DetailType: "OrderCreated", Detail: JSON.stringify({ orderId: "o-1" }) },
  ],
});`}
            language="typescript"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health check</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p>Use <code>AwsxHealthIndicator.checkEventBridge(key)</code> with <code>@nestjs/terminus</code> to verify the EventBridge client can list event buses (lightweight connectivity check).</p>
        </CardContent>
      </Card>
    </div>
  );
}
