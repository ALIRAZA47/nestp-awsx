import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SqsPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Services"
        title="SQS Service"
        description="`SqsService` supports core queue operations plus JSON helpers and batch utilities for high-throughput message workflows."
      />

      <Card>
        <CardHeader>
          <CardTitle>Method coverage</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p>Core methods: `sendMessage`, `receiveMessages`, `deleteMessage`, `purgeQueue`, `sendBatch`, `deleteBatch`.</p>
          <p>Helper methods: `sendJson`, `receiveJson`, and `sendJsonBatch` for JSON-first queue workflows.</p>
          <p>Batch helpers are useful for reducing API calls and increasing throughput in worker systems.</p>
        </CardContent>
      </Card>

      <ExampleReference id="sqs.core" />
      <ExampleReference id="sqs.helpers" />
    </div>
  );
}
