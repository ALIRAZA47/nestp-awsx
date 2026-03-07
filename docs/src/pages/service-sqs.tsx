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
          <p>Helper methods: `sendJson`, `receiveJson`, and `sendJsonBatch` for JSON-first queue workflows. When `defaultQueueUrl` is set in config, `QueueUrl` can be omitted and `sendJson(payload)` uses the default queue.</p>
          <p>`processBatch(params, processor)` receives messages, runs your async processor, then deletes them on success; if the processor throws, messages are not deleted and reappear after visibility timeout.</p>
          <p>For long-running consumers, inject `AwsxSqsConsumerService` and call `startConsumer(handler, options?)` in `onModuleInit`; it long-polls, invokes the handler per batch, and auto-deletes on success. Use `stopConsumer()` or let `onModuleDestroy` stop it.</p>
        </CardContent>
      </Card>

      <ExampleReference id="sqs.core" />
      <ExampleReference id="sqs.helpers" />
    </div>
  );
}
