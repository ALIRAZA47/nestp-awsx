import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function S3Page() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Services"
        title="S3 Service"
        description="`S3Service` wraps core object operations and provides helpers for JSON workflows, signed URLs, batch uploads, and upload progress tracking."
      />

      <Card>
        <CardHeader>
          <CardTitle>Core methods</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p>`putObject`, `getObject`, `listObjects`, `deleteObject`, `deleteMany`, and `exists` map directly to SDK operations.</p>
          <p>If `defaultBucket` is configured, calls that require a bucket can omit `Bucket` and AWSX injects it automatically.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Helper methods and behavior</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>`putJson` and `getJson` reduce JSON serialization/deserialization boilerplate.</li>
            <li>`getSignedUrl` supports enum-driven operation type (`GetObject` or `PutObject`).</li>
            <li>`putMany` is fail-safe and returns <code>{"{ successes, failures }"}</code> instead of failing whole batch early.</li>
            <li>`uploadWithProgress` uses multipart upload and reports transfer updates through callback.</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference id="s3.core" description="Core object CRUD and listing." />
      <ExampleReference id="s3.helpers" description="JSON helpers, key listing, and existence checks." />
      <ExampleReference id="s3.signedUrl" description="Generate `getObject` and `putObject` presigned URLs." />
      <ExampleReference id="s3.putMany" description="Failsafe bulk uploads with success/failure partitions." />
      <ExampleReference id="s3.progress" description="Multipart upload helper with progress callback." />
    </div>
  );
}
